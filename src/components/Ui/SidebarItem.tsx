import type { ReactElement } from "react";

export function SidebarItems ({text, icon}:{
    text: string;
    icon: ReactElement
}) {
    return (
        <div className=" flex ml-7 cursor-pointer hover:bg-gray-600 rounded-lg t ">
            <div className="p-2">
                {icon}

            </div>
            <div className="p-2">
                {text}

            </div>
             

        </div>
    )
}