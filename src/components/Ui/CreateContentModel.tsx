import { Button } from "./Button";
import { CrossIcon } from "./Icons/cross";
import { useRef, useState, type ChangeEvent, type ReactNode, type RefObject, type MutableRefObject } from "react";
import { TwitterIcon } from "./Icons/twitter";
import { YoutubeIcon } from "./Icons/youtube";
import { DocumentIcon } from "./Icons/document";
import { LinkIcon } from "./Icons/link";
import axios from "axios";
import { BackendUrl } from "../../config";
type ContentType = "twitter" | "youtube" | "document" | "link";


interface CreateContentModelProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}


export function CreateContentModel({ open, onClose, onSuccess }: CreateContentModelProps) {
  const title = useRef<HTMLInputElement>(null);
  const link = useRef<HTMLInputElement>(null);
  const [contentType, setContentType] = useState<ContentType>("youtube");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function addcontent() {
    if (isSubmitting) return;
  // const titleValue = title.current?.value?.trim();
  const linkValue = link.current?.value?.trim();

    if (!linkValue) {
      alert("Please enter a valid link");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
    await axios.post(
        `${BackendUrl}/content/create`,
        {
          // Backend currently uses only link and type; keeping title for future parity
          link: linkValue,
          type: contentType
        },
        token
          ? { headers: { Authorization: token } }
          : undefined
      );

      // reset inputs
      if (title.current) title.current.value = "";
      if (link.current) link.current.value = "";
  setContentType("youtube");
    // notify parent to refresh
    if (onSuccess) onSuccess();
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to add content";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  }
  
    return (
        <div>
             {open && (
              <div className="fixed w-screen h-screen top-0 left-0 bg-slate-900/80 flex justify-center items-center">
                <div className="flex justify-center">
                  <div className="bg-white max-w-md w-[90vw] p-5 border-2 border-gray-200 rounded-2xl shadow-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-lg font-semibold text-slate-800">Add Content</div>
                      <button onClick={onClose} className="cursor-pointer text-slate-600 hover:text-slate-900">
                        <CrossIcon />
                      </button>
                    </div>

                    {/* Type selector */}
                    <div className="flex items-center gap-2 mb-3">
                      <TypePill
                        active={contentType === "twitter"}
                        label="Tweet"
                        icon={<TwitterIcon />}
                        onClick={() => setContentType("twitter")}
                      />
                      <TypePill
                        active={contentType === "youtube"}
                        label="YouTube"
                        icon={<YoutubeIcon />}
                        onClick={() => setContentType("youtube")}
                      />
                      <TypePill
                        active={contentType === "document"}
                        label="Doc"
                        icon={<DocumentIcon />}
                        onClick={() => setContentType("document")}
                      />
                      <TypePill
                        active={contentType === "link"}
                        label="Link"
                        icon={<LinkIcon />}
                        onClick={() => setContentType("link")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Input reference={title} placeholder={"Title (optional)"} />
                      <Input reference={link} placeholder={"Paste link here"} type="url" />
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      <Button
                        variant="primary"
                        text={isSubmitting ? "Submitting..." : "Submit"}
                        size="sm"
                        onClick={addcontent}
                      />
                    </div>
                  </div>
                </div>
              </div>
             )}
        </div>
       

    )
}

type InputProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  reference?: RefObject<HTMLInputElement | null> | MutableRefObject<HTMLInputElement | null>;
  type?: string;
};

function Input ({onChange, placeholder, reference, type = "text"}: InputProps) {
  return (
    <div>
      <input
        ref={reference}
        placeholder={placeholder}
        type={type}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={onChange}
      />
    </div>
  )
}

function TypePill({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
        active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className="inline-flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}