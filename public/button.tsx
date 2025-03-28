import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "btn btn-outline btn-md md:btn-md border-2 btn-primary text-white",
        className
      )}
    >
      {children}
    </button>
  );
}
