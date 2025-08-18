
export interface ButtonProps{
    variant :"primary"|"secondary"| "signout";
    size :"sm"|"md"|"lg";
    text: string;
    startIcon? :any;
    onClick?:() => void;
    // HTML button type; default to 'button' so buttons inside forms don't submit unless explicitly set
    type?: "button" | "submit" | "reset";
}
const variantStyles = {
    "secondary": "bg-[#5046e4] text-white",
    "primary": "bg-[#e0e7fe] text-purple-600",
    "signout": "bg-[#f87171] text-white"
}
const defeaultStyle= "rounded-lg flex items-center cursor-pointer"
const sizeStyles ={
    "sm": "py-1 px-2",
    "md":"py-2 px-4",
    "lg":"py-2 px-6"
}

export const Button = (props:ButtonProps) =>{
    return(
        <button type={props.type ?? "button"} onClick={props.onClick} className={ `${variantStyles[props.variant]} ${defeaultStyle} ${sizeStyles[props.size]}`}> {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null} {props.text} </button>
    )

}