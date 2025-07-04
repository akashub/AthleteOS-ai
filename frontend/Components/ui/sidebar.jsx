import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className = "" }) {
  const { isOpen } = useContext(SidebarContext);
  
  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 ${className}`}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className = "" }) {
  return (
    <div className={`p-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className = "" }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarGroup({ children }) {
  return <div>{children}</div>;
}

export function SidebarGroupContent({ children }) {
  return <div>{children}</div>;
}

export function SidebarMenu({ children, className = "" }) {
  return (
    <nav className={`space-y-2 ${className}`}>
      {children}
    </nav>
  );
}

export function SidebarMenuItem({ children }) {
  return <div>{children}</div>;
}

export function SidebarMenuButton({ children, asChild = false, className = "", ...props }) {
  const Comp = asChild ? 'div' : 'button';
  return (
    <Comp className={`w-full text-left px-3 py-2 rounded-md transition-colors ${className}`} {...props}>
      {children}
    </Comp>
  );
}

export function SidebarFooter({ children, className = "" }) {
  return (
    <div className={`p-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarTrigger({ className = "", ...props }) {
  const { setIsOpen, isOpen } = useContext(SidebarContext);
  
  return (
    <button
      className={`p-2 rounded-md hover:bg-gray-100 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
} 