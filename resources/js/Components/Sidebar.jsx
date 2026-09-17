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
  const hasActivePathMatch = activePaths.some((pattern) =>
    matchesPathPattern(currentPath, pattern)
  );
  const isActive =
    !hasChildren && (matchesPathPattern(currentPath, item.href) || hasActivePathMatch);

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
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group ${
              isGroupActive
                ? 'bg-[#0f4a2d] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0f4a2d] hover:bg-emerald-50/60'
            }`}
          >
            {Icon && <Icon className="h-5 w-5 transition-transform group-hover:scale-105" />}
            <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-slate-400 group-hover:bg-[#0f4a2d]" />
          </button>
        </div>
      );
    }

    return (
      <div
        className={`my-1 select-none transition-all duration-200 rounded-2xl ${
          isGroupOpen
            ? 'bg-emerald-50/60 border border-emerald-100/80 p-1.5'
            : 'border border-transparent'
        }`}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group
            ${
              isGroupActive
                ? 'text-[#0f4a2d] font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 font-medium'
            }
          `}
        >
          {Icon && (
            <Icon
              className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                isGroupActive ? 'text-[#0f4a2d]' : 'text-slate-500 group-hover:text-[#0f4a2d]'
              }`}
            />
          )}
          <span title={item.label} className="flex-1 text-left truncate">
            {item.label}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              isGroupOpen
                ? 'rotate-180 text-[#0f4a2d]'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            isGroupOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 mt-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="pl-3 pr-1 space-y-1 py-0.5">
              {item.children.map((child) => {
                const active = currentPath === child.href || isChildActive(child);
                return (
                  <Link
                    key={child.label}
                    href={child.href}
                    className={`
                      flex items-center px-3.5 py-2 rounded-xl text-sm transition-all duration-150 font-medium
                      ${
                        active
                          ? 'bg-[#0f4a2d] text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-[#0f4a2d] hover:bg-white/80'
                      }
                    `}
                  >
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
            w-10 h-10 flex items-center justify-center rounded-xl transition-all group
            ${
              isActive
                ? 'bg-[#0f4a2d] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0f4a2d] hover:bg-emerald-50/60'
            }
          `}
        >
          {Icon && (
            <Icon
              className={`h-5 w-5 transition-transform group-hover:scale-105 ${
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
        flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group my-0.5 select-none border
        ${
          isActive
            ? 'bg-[#0f4a2d] text-white font-semibold border-transparent shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border-transparent'
        }
      `}
    >
      {Icon && (
        <Icon
          className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
            isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#0f4a2d]'
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
      className={`flex flex-col h-full bg-white p-3 rounded-2xl border border-slate-100 shadow-xs transition-all duration-300 ease-out relative ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
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
      <nav className="flex-1 overflow-y-auto scrollbar-none px-0.5 py-1 space-y-3.5">
        {navCategories.map((group, idx) => (
          <div key={group.category || idx} className="space-y-0.5">
            {!collapsed && group.category && (
              <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
          collapsed ? 'w-[80px]' : 'w-[272px]'
        }`}
      >
        {inner}
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <aside className="relative z-50 flex flex-col h-full bg-white border-r border-slate-100 shadow-2xl w-[270px] p-3">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-1">
              <span className="font-bold text-sm text-slate-800 tracking-tight">Menu</span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-0.5 py-1 space-y-3.5">
              {navCategories.map((group, idx) => (
                <div key={group.category || idx} className="space-y-0.5">
                  {group.category && (
                    <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
