import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

function matchesPathPattern(path, pattern) {
  if (!pattern) {
    return false;
  }

  if (pattern.endsWith('*')) {
    return path.startsWith(pattern.slice(0, -1));
  }

  return path === pattern;
}

function NavItem({ item, collapsed }) {
  const { url } = usePage();
  const currentPath = url.split('?')[0];
  const Icon = item.icon;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const activePaths = Array.isArray(item.activePaths) ? item.activePaths : [];
  const hasActivePathMatch = activePaths.some((pattern) =>
    matchesPathPattern(currentPath, pattern)
  );
  const isActive =
    !hasChildren && (matchesPathPattern(currentPath, item.href) || hasActivePathMatch);

  const isChildActive = (child) => {
    if (currentPath === child.href) {
      return true;
    }
    const childActivePaths = Array.isArray(child.activePaths) ? child.activePaths : [];
    return childActivePaths.some((pattern) => matchesPathPattern(currentPath, pattern));
  };

  const childActive = hasChildren && item.children.some(isChildActive);

  const [open, setOpen] = useState(childActive);
  const isGroupActive = hasChildren && childActive;
  const isGroupOpen = hasChildren && (open || childActive);

  if (hasChildren) {
    if (collapsed) {
      return (
        <div className="relative group flex justify-center my-1 select-none">
          <button
            title={item.label}
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-500 hover:text-theme-accent hover:bg-theme-accent-5 active:bg-theme-accent-10 transition-all relative shadow-sm border border-transparent hover:border-theme-accent/10 group"
          >
            {Icon && <Icon className="h-5 w-5 text-slate-600 group-hover:animate-jello" />}
            <ChevronDown className="h-2.5 w-2.5 absolute bottom-1.5 right-1.5 text-slate-400" />
          </button>
        </div>
      );
    }

    return (
      <div
        className={`my-1 select-none overflow-hidden rounded-[12px] border transition-[background-color,border-color,box-shadow,padding] duration-300 ease-out ${isGroupActive ? 'bg-theme-accent-10 border-theme-accent-soft p-1 shadow-sm' : 'bg-white/20 border-white/60 p-0'}`}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className={`
                        w-full flex items-center gap-2.5 rounded-xl text-sm transition-colors duration-200 group
                        ${isGroupActive ? 'text-theme-accent px-2 py-1' : 'text-slate-600 hover:text-theme-accent hover:bg-theme-accent-5 px-3 py-2'}
                    `}
        >
          {Icon && (
            <Icon
              className={`h-4.5 w-4.5 shrink-0 transition-colors group-hover:animate-jello ${isGroupActive ? 'text-theme-accent' : 'text-slate-650 group-hover:text-theme-accent'}`}
            />
          )}

          <span
            title={item.label}
            className={`flex-1 text-left truncate ${isGroupActive ? 'text-theme-accent' : 'text-slate-700'}`}
          >
            {item.label}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${isGroupOpen ? 'rotate-180 text-theme-accent' : 'text-slate-400 group-hover:text-theme-accent'}`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isGroupOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
        >
          <div className="overflow-hidden">
            <div className="relative pl-5 ml-[21px] space-y-0.5 pb-1.5">
              {/* Tree vertical connector line */}
              <div className="absolute left-0 top-0 bottom-3.5 w-px bg-black/30" />

              {(() => {
                const exactMatchChild = item.children.find((child) => currentPath === child.href);
                return item.children.map((child) => {
                  const active = exactMatchChild ? child === exactMatchChild : isChildActive(child);
                  return (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={`
                                                relative flex items-center gap-2 pl-4 pr-3 py-1.5 rounded-lg text-sm transition-colors duration-200
                                                ${active ? 'text-theme-accent bg-theme-accent-10' : 'text-slate-600 hover:text-theme-accent hover:bg-theme-accent-5'}
                                            `}
                    >
                      {/* Tree horizontal branch connector line */}
                      <div className="absolute left-0 top-[14px] w-2.5 h-px bg-black/30" />
                      <span title={child.label} className="truncate">
                        {child.label}
                      </span>
                    </Link>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="relative group flex justify-center my-1 select-none">
        <Link
          href={item.href}
          title={item.label}
          className={`
                        w-8 h-8 flex items-center justify-center rounded-2xl transition-all shadow-sm border group
                        ${isActive ? 'bg-white/95 text-theme-accent border-white/70 shadow-sm' : 'text-slate-500 hover:text-theme-accent hover:bg-theme-accent-5 active:bg-theme-accent-10 border-transparent'}
                    `}
        >
          {Icon && (
            <Icon
              className={`h-5 w-5 group-hover:animate-jello ${isActive ? 'text-theme-accent' : 'text-slate-600'}`}
            />
          )}
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group my-1 select-none border
                ${isActive ? 'bg-theme-accent-10 text-theme-accent shadow-sm border-theme-accent-soft' : 'text-slate-600 hover:text-theme-accent hover:bg-theme-accent-5 border-transparent'}
            `}
    >
      {Icon && (
        <Icon
          className={`h-4.5 w-4.5 shrink-0 transition-colors group-hover:animate-jello ${isActive ? 'text-theme-accent' : 'text-slate-500 group-hover:text-theme-accent'}`}
        />
      )}

      <span
        title={item.label}
        className={`truncate ${isActive ? 'text-theme-accent' : 'text-slate-700'}`}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ─────────────────────────────────────────────
// Sidebar shell (desktop + mobile drawer)
// ─────────────────────────────────────────────
export default function Sidebar({ open, onClose, navItems = [] }) {
  const [collapsed, setCollapsed] = useState(false);

  const inner = (
    <div
      className={`flex flex-col h-full bg-white/70 backdrop-blur-md rounded-[12px] border border-white/70 shadow-[0px_4px_4px_0px_#00000040] transition-all duration-300 ease-out relative ${collapsed ? 'w-[76px]' : 'w-[270px]'}`}
    >
      {/* Collapse toggle */}
      {!collapsed ? (
        <button
          onClick={() => setCollapsed(true)}
          className="absolute top-7 right-0 z-20 w-5 h-10 border border-dashed border-theme-accent/30 bg-theme-bg-light/50 hover:bg-theme-bg-light text-theme-accent rounded flex items-center justify-center cursor-pointer transition-colors shadow-sm"
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute top-7 right-[-20px] z-20 w-5 h-10 bg-white/70 border border-dashed border-theme-accent/30 bg-theme-bg-light/50 hover:bg-theme-bg-light text-theme-accent rounded flex items-center justify-center cursor-pointer transition-colors shadow-md"
          title="Expand sidebar"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Scrollable nav list */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop — always visible */}
      <aside
        className={`hidden md:flex flex-col h-full py-4 pl-4 shrink-0 transition-all duration-300 relative z-20 overflow-visible ${collapsed ? 'w-[92px]' : 'w-[286px]'}`}
      >
        {inner}
      </aside>

      {/* Mobile — drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-45 md:hidden flex">
          <div className="fixed inset-0 bg-slate-800/30 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative z-50 flex flex-col h-full border border-white/70 shadow-[0px_4px_4px_0px_#00000040] bg-white w-[270px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-slate-800">Menu</span>
              <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-50">
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.label} item={item} collapsed={false} />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
