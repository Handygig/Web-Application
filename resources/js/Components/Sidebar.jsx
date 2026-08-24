import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

function matchesPathPattern(path, pattern) {
  if (!pattern) return false;
  if (pattern.endsWith('*')) return path.startsWith(pattern.slice(0, -1));
  return path === pattern;
}

function NavItem({ item, collapsed }) {
  const { url } = usePage();
  const currentPath = url.split('?')[0];
  const Icon = item.icon;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const activePaths = Array.isArray(item.activePaths) ? item.activePaths : [];
  const hasActivePathMatch = activePaths.some((pattern) => matchesPathPattern(currentPath, pattern));
  const isActive = !hasChildren && (matchesPathPattern(currentPath, item.href) || hasActivePathMatch);

  const isChildActive = (child) => {
    if (currentPath === child.href) return true;
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
        <div className="relative group flex justify-center my-0.5 select-none">
          <button
            title={item.label}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all group ${
              isGroupActive
                ? 'bg-[#0f4a2d] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0f4a2d] hover:bg-emerald-50/60'
            }`}
          >
            {Icon && <Icon className="h-4 w-4 transition-transform group-hover:scale-105" />}
            <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-slate-400 group-hover:bg-[#0f4a2d]" />
          </button>
        </div>
      );
    }

    return (
      <div className="my-0.5 select-none transition-all duration-200">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`
            w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 group border
            ${
              isGroupActive
                ? 'bg-emerald-50/80 text-[#0f4a2d] border-emerald-200/60 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border-transparent'
            }
          `}
        >
          {Icon && (
            <Icon
              className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                isGroupActive ? 'text-[#0f4a2d]' : 'text-slate-500 group-hover:text-[#0f4a2d]'
              }`}
            />
          )}
          <span title={item.label} className="flex-1 text-left truncate font-medium">
            {item.label}
          </span>
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-300 ${
              isGroupOpen ? 'rotate-180 text-[#0f4a2d]' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            isGroupOpen ? 'grid-rows-[1fr] opacity-100 mt-0.5' : 'grid-rows-[0fr] opacity-0 mt-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="relative pl-5 ml-3 space-y-0.5 py-0.5">
              <div className="absolute left-2 top-1.5 bottom-2.5 w-0.5 rounded-full bg-slate-200" />
              {item.children.map((child) => {
                const active = currentPath === child.href || isChildActive(child);
                return (
                  <Link
                    key={child.label}
                    href={child.href}
                    className={`
                      relative flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition-all duration-150 font-medium
                      ${
                        active
                          ? 'text-[#0f4a2d] bg-emerald-50/80 font-semibold'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                      }
                    `}
                  >
                    <span
                      className={`h-1 w-1 rounded-full transition-all ${
                        active ? 'bg-[#0f4a2d] scale-125' : 'bg-slate-300'
                      }`}
                    />
                    <span title={child.label} className="truncate">
                      {child.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="relative group flex justify-center my-0.5 select-none">
        <Link
          href={item.href}
          title={item.label}
          className={`
            w-9 h-9 flex items-center justify-center rounded-xl transition-all group
            ${
              isActive
                ? 'bg-[#0f4a2d] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0f4a2d] hover:bg-emerald-50/60'
            }
          `}
        >
          {Icon && (
            <Icon
              className={`h-4 w-4 transition-transform group-hover:scale-105 ${
                isActive ? 'text-white' : 'text-slate-600 group-hover:text-[#0f4a2d]'
              }`}
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
        flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 group my-0.5 select-none border
        ${
          isActive
            ? 'bg-emerald-50/80 text-[#0f4a2d] font-semibold border-emerald-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border-transparent'
        }
      `}
    >
      {Icon && (
        <Icon
          className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
            isActive ? 'text-[#0f4a2d]' : 'text-slate-500 group-hover:text-[#0f4a2d]'
          }`}
        />
      )}
      <span title={item.label} className="truncate">
        {item.label}
      </span>
    </Link>
  );
}

export default function Sidebar({ open, onClose, navCategories = [] }) {
  const [collapsed, setCollapsed] = useState(false);

  const inner = (
    <div
      className={`flex flex-col h-full bg-white p-2.5 rounded-2xl border border-slate-100 shadow-xs transition-all duration-300 ease-out relative ${
        collapsed ? 'w-[64px]' : 'w-[220px]'
      }`}
    >
      {/* Collapse/Expand Toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute top-5 -right-2.5 z-30 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs transition-all hover:bg-[#0f4a2d] hover:text-white hover:border-[#0f4a2d] active:scale-95"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Nav Categories */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-0.5 py-1 space-y-3">
        {navCategories.map((group, idx) => (
          <div key={group.category || idx} className="space-y-0.5">
            {!collapsed && group.category && (
              <div className="px-2.5 pt-1.5 pb-0.5 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>{group.category}</span>
              </div>
            )}
            {group.items.map((item) => (
              <NavItem key={item.label} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden md:flex flex-col h-full py-2.5 pl-3 shrink-0 transition-all duration-300 relative z-20 ${
          collapsed ? 'w-[76px]' : 'w-[232px]'
        }`}
      >
        {inner}
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
          <aside className="relative z-50 flex flex-col h-full bg-white border-r border-slate-100 shadow-2xl w-[230px] p-2.5">
            <div className="flex items-center justify-between px-2.5 py-2 border-b border-slate-100 mb-1">
              <span className="font-bold text-xs text-slate-800 tracking-tight">Menu</span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-0.5 py-1 space-y-3">
              {navCategories.map((group, idx) => (
                <div key={group.category || idx} className="space-y-0.5">
                  {group.category && (
                    <div className="px-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {group.category}
                    </div>
                  )}
                  {group.items.map((item) => (
                    <NavItem key={item.label} item={item} collapsed={false} />
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
