import { Button } from "./Button";
import { DocumentIcon } from "./Icons/document";
import { LinkIcon } from "./Icons/link";
import { TwitterIcon } from "./Icons/twitter";
import { YoutubeIcon } from "./Icons/youtube";
import { SidebarItems } from "./SidebarItem";
import axios from "axios";

export function Sidebar(){
    function handleSignOut() {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            // Remove default auth header for future requests
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete axios.defaults.headers.common["Authorization"];
        } finally {
            // Hard redirect to signin to reset app state
            window.dispatchEvent(new Event('auth-changed'));
            window.location.href = "/signin";
        }
    }
    return (
        <div className=" h-screen w-64 bg-[#0f172a] border-2 fixed left-0 top-0 ">
            <div className="flex items-center px-4 pt-6 pb-4">
                <img className="w-12 h-12 object-contain mr-3" src="/Memo2.png" alt="MemoArcX Logo" />
                <div className="text-[#d9dbe0] font-sans text-2xl font-semibold ">
                    MemoArcX
                </div>
            </div>
            
            
            <div className="text-[#d9dbe0] text-md space-y-2 px-4 mt-8">
                <SidebarItems text=" Tweets" icon={<TwitterIcon />} />
                <SidebarItems text=" Videos" icon={<YoutubeIcon />} />
                <SidebarItems text=" Documents" icon={<DocumentIcon />} />
                <SidebarItems text=" Links" icon={<LinkIcon />} />
            </div>
            <div className=" flex  bottom-1 fixed p-4 ml-7 ">
                <Button onClick={handleSignOut} variant="signout" size="lg" text="Sign Out" />
            </div>
        </div>
    )

}