import * as React from "react";
export function AlertDialog({ children }) { return <div>{children}</div>; }
export function AlertDialogTrigger({ children }) { return <div>{children}</div>; }
export function AlertDialogContent({ children }) { return <div>{children}</div>; }
export function AlertDialogTitle({ children }) { return <div>{children}</div>; }
export function AlertDialogDescription({ children }) { return <div>{children}</div>; }
export function AlertDialogAction({ children }) { return <button>{children}</button>; }
export function AlertDialogCancel({ children }) { return <button>{children}</button>; }

export function AlertDialogFooter({ children, className = "", ...props }) {
    return (
      <div className={`flex flex-col-reverse sm:flex-row sm:justify-end gap-2 ${className}`} {...props}>
        {children}
      </div>
    );
}

// Add AlertDialogHeader export
export function AlertDialogHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props}>
      {children}
    </div>
  );
}