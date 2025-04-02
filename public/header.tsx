import clsx from "clsx";
interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Header({ children, className, ...rest }: DivProps) {
  return (
    <div
      {...rest}
      className={clsx("flex pb-2 items-center gap-2 relative", className)}
    >
      <h1 className="text-[#C778DD]"># {children}</h1>
      <div className="border border-[#C778DD] h-0 w-[311px]" />
    </div>
  );
}
