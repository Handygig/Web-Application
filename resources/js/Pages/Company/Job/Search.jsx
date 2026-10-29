import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FloatingToast from '@/Components/Other/FloatingToast';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import {
  Search,
  MapPin,
  Briefcase,
  User,
  Phone,
  Clock,
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Sparkles,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Navigation,
  MessageSquare,
  ShieldCheck,
  Info,
  ArrowRight,
  Share2,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const MAP_LIBRARIES = ['places'];

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
  minHeight: '600px',
};

// Default center: Colombo, Sri Lanka
const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };

// Custom clean map styling
const MAP_STYLES = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ lightness: 20 }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cde2e5' }] },
];

// Rich fallback ongoing jobs distributed across the city
const FALLBACK_ONGOING_JOBS = [
  {
    id: 101,
    job_code: 'JOB-4102',
    title: 'Whole-house Air Duct Cleaning & Sanitization',
    service_category: { service_name: 'HVAC', icon: 'Wind' },
    status: 'in_progress',
    sub_status: 'Working On-Site',
    budget: '65.00',
    price_badge: 'LKR 65',
    started_at: '45 mins ago',
    customer: {
      user: {
        name: 'Sarah Jenkins',
        phone: '+94 77 123 4567',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'SJ',
      },
    },
    property: {
      address_line: 'No. 42 Alfred House Gardens, Colombo 03',
      city: 'Colombo',
      latitude: 6.8985,
      longitude: 79.8558,
    },
    technician: {
      id: 1,
      name: 'Ananya Perera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '+94 71 889 2233',
      specialty: 'HVAC Specialist',
      avatar_initials: 'AP',
    },
  },
  {
    id: 102,
    job_code: 'JOB-4108',
    title: 'Main Breaker Upgrade & Dedicated Line Setup',
    service_category: { service_name: 'Electrical', icon: 'Zap' },
    status: 'in_progress',
    sub_status: 'On-Site Diagnostic',
    budget: '85.00',
    price_badge: 'LKR 85',
    started_at: '1h 15m ago',
    customer: {
      user: {
        name: 'Marcus Vance',
        phone: '+94 77 987 6543',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'MV',
      },
    },
    property: {
      address_line: '88 Ward Place, Cinnamon Gardens',
      city: 'Colombo 07',
      latitude: 6.9147,
      longitude: 79.8687,
    },
    technician: {
      id: 2,
      name: 'Liam Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '+94 76 554 1122',
      specialty: 'Master Electrician',
      avatar_initials: 'LC',
    },
  },
  {
    id: 103,
    job_code: 'JOB-4115',
    title: 'Emergency Kitchen Copper Pipe Leak Repair',
    service_category: { service_name: 'Plumbing', icon: 'Droplets' },
    status: 'in_progress',
    sub_status: 'En Route',
    budget: '120.00',
    price_badge: 'LKR 120',
    started_at: '15 mins ago',
    customer: {
      user: {
        name: 'Elena Rostova',
        phone: '+94 75 443 8899',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'ER',
      },
    },
    property: {
      address_line: '215 Galle Road, Dehiwala',
      city: 'Dehiwala',
      latitude: 6.8512,
      longitude: 79.8665,
    },
    technician: {
      id: 3,
      name: 'Samantha Reed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '+94 72 331 9900',
      specialty: 'Plumbing Lead',
      avatar_initials: 'SR',
    },
  },
  {
    id: 104,
    job_code: 'JOB-4122',
    title: 'Perimeter Smart Security Camera Installation',
    service_category: { service_name: 'Smart Home', icon: 'Sparkles' },
    status: 'assigned',
    sub_status: 'Dispatched',
    budget: '150.00',
    price_badge: 'LKR 150',
    started_at: 'Just dispatched',
    customer: {
      user: {
        name: 'David Miller',
        phone: '+94 77 662 3344',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'DM',
      },
    },
    property: {
      address_line: '54 Kotte Road, Rajagiriya',
      city: 'Rajagiriya',
      latitude: 6.9082,
      longitude: 79.8974,
    },
    technician: {
      id: 4,
      name: 'Carlos Mendez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '+94 71 229 4488',
      specialty: 'Systems Tech',
      avatar_initials: 'CM',
    },
  },
  {
    id: 105,
    job_code: 'JOB-4129',
    title: 'Commercial Water Heater Unit Servicing',
    service_category: { service_name: 'HVAC', icon: 'Wind' },
    status: 'in_progress',
    sub_status: 'Working On-Site',
    budget: '320.00',
    price_badge: 'LKR 320',
    started_at: '2h 10m ago',
    customer: {
      user: {
        name: 'Dinesh Wickramasinghe',
        phone: '+94 77 551 2299',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'DW',
      },
    },
    property: {
      address_line: '14 Parliament Road, Battaramulla',
      city: 'Battaramulla',
      latitude: 6.8998,
      longitude: 79.9189,
    },
    technician: {
      id: 1,
      name: 'Alex Rivera',
      phone: '+94 71 889 2233',
      specialty: 'HVAC Specialist',
      avatar_initials: 'AR',
    },
  },
  {
    id: 106,
    job_code: 'JOB-4134',
    title: 'Bathroom Fixture & Drainage Restoration',
    service_category: { service_name: 'Plumbing', icon: 'Droplets' },
    status: 'in_progress',
    sub_status: 'Final Testing',
    budget: '220.00',
    price_badge: 'LKR 220',
    started_at: '3h ago',
    customer: {
      user: {
        name: 'Ananya Sharma',
        phone: '+94 78 991 7722',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'AS',
      },
    },
    property: {
      address_line: '85 Hotel Road, Mount Lavinia',
      city: 'Mount Lavinia',
      latitude: 6.8375,
      longitude: 79.8654,
    },
    technician: {
      id: 3,
      name: 'Samantha Reed',
      phone: '+94 72 331 9900',
      specialty: 'Plumbing Lead',
      avatar_initials: 'SR',
    },
  },
  {
    id: 107,
    job_code: 'JOB-4140',
    title: 'Urgent Circuit Breaker Tripping & Spark Diagnostic',
    service_category: { service_name: 'Electrical', icon: 'Zap' },
    status: 'pending',
    sub_status: 'New Request',
    budget: '95.00',
    price_badge: 'LKR 95',
    started_at: 'Just now',
    customer: {
      user: {
        name: 'Roshan Fernando',
        phone: '+94 77 445 1199',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'RF',
      },
    },
    property: {
      address_line: '12 Vajira Road, Bambalapitiya',
      city: 'Colombo 04',
      latitude: 6.8892,
      longitude: 79.8596,
    },
    technician: null,
  },
  {
    id: 108,
    job_code: 'JOB-4145',
    title: 'Main Sewer Line Emergency Clearing',
    service_category: { service_name: 'Plumbing', icon: 'Droplets' },
    status: 'pending',
    sub_status: 'New Request',
    budget: '180.00',
    price_badge: 'LKR 180',
    started_at: '12 mins ago',
    customer: {
      user: {
        name: 'Kavindi Jayawardena',
        phone: '+94 71 332 8844',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'KJ',
      },
    },
    property: {
      address_line: '77 Horton Place, Cinnamon Gardens',
      city: 'Colombo 07',
      latitude: 6.9125,
      longitude: 79.8732,
    },
    technician: null,
  },
];

// Module-level image cache for preloaded customer avatars
const AVATAR_IMAGE_CACHE = new Map();

const drawInitialsFallback = (ctx, cx, cy, r, initials) => {
  const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  grad.addColorStop(0, '#0f4a2d');
  grad.addColorStop(1, '#1b5e39');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  ctx.font = 'bold 10.5px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials || 'CU', cx, cy + 0.5);
};

const getCustomerPinFallbackSvg = ({ customerInitials = 'CU', priceText = 'LKR 65', isSelected = false }) => {
  const haloColor = isSelected ? '#a8c848' : '#d0e08b';
  const strokeWidth = isSelected ? '2' : '1.2';
  const w = isSelected ? 68 : 60;
  const h = isSelected ? 84 : 76;
  const cx = w / 2;
  const cy = isSelected ? 46 : 42;
  const rHalo = isSelected ? 18 : 16;
  const rAvatar = isSelected ? 15.5 : 13.5;
  const tipY = isSelected ? 80 : 72;
  const dotX = cx + (isSelected ? 12 : 11);
  const dotY = cy + (isSelected ? 10 : 9);
  const pillW = isSelected ? 50 : 44;
  const pillH = isSelected ? 18 : 16;
  const pillX = cx - pillW / 2;
  const pillY = 2;

  return `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <defs>
      <filter id='pin-shadow-${isSelected ? 'sel' : 'norm'}' x='-25%' y='-15%' width='150%' height='150%'>
        <feDropShadow dx='0' dy='3' stdDeviation='2.5' flood-color='#000000' flood-opacity='0.35'/>
      </filter>
      <clipPath id='avatar-clip-${isSelected ? 'sel' : 'norm'}'>
        <circle cx='${cx}' cy='${cy}' r='${rAvatar}'/>
      </clipPath>
      <linearGradient id='grad-${isSelected ? 'sel' : 'norm'}' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#0f4a2d'/>
        <stop offset='100%' stop-color='#1f6844'/>
      </linearGradient>
    </defs>
    <g filter='url(#pin-shadow-${isSelected ? 'sel' : 'norm'})'>
      <circle cx='${cx}' cy='${cy}' r='${rHalo}' fill='${haloColor}' stroke='#bdd073' stroke-width='${strokeWidth}'/>
      <polygon points='${cx - 9},${cy + 6} ${cx},${tipY} ${cx + 9},${cy + 6}' fill='#142c18'/>
    </g>
    <g clip-path='url(#avatar-clip-${isSelected ? 'sel' : 'norm'})'>
      <rect x='${cx - rAvatar}' y='${cy - rAvatar}' width='${rAvatar * 2}' height='${rAvatar * 2}' fill='url(#grad-${isSelected ? 'sel' : 'norm'})'/>
      <text x='${cx}' y='${cy + 4}' font-family='system-ui, -apple-system, sans-serif' font-size='${isSelected ? 11 : 10}' font-weight='800' fill='#ffffff' text-anchor='middle'>${customerInitials}</text>
    </g>
    <circle cx='${cx}' cy='${cy}' r='${rAvatar}' fill='none' stroke='#ffffff' stroke-width='2.5'/>
    <circle cx='${dotX}' cy='${dotY}' r='4.5' fill='#0088e8' stroke='#ffffff' stroke-width='1.5'/>
    <g filter='url(#pin-shadow-${isSelected ? 'sel' : 'norm'})'>
      <rect x='${pillX}' y='${pillY}' width='${pillW}' height='${pillH}' rx='${pillH / 2}' fill='${haloColor}' stroke='#bdd073' stroke-width='1.2'/>
      <text x='${cx}' y='${pillY + pillH / 2 + 3}' font-family='system-ui, -apple-system, sans-serif' font-size='${isSelected ? 9.5 : 8.5}' font-weight='800' fill='#2c3d14' text-anchor='middle'>${priceText}</text>
    </g>
  </svg>`;
};

const renderCustomerPinCanvas = (customerImg, customerInitials, priceText, isSelected = false) => {
  if (typeof document === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    const scale = 2; // High-DPI Retina
    const w = isSelected ? 68 : 60;
    const h = isSelected ? 84 : 76;
    canvas.width = w * scale;
    canvas.height = h * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.scale(scale, scale);

    const cx = w / 2;
    const cy = isSelected ? 46 : 42;
    const rHalo = isSelected ? 18 : 16;
    const rAvatar = isSelected ? 15.5 : 13.5;
    const haloColor = isSelected ? '#a8c848' : '#d0e08b';
    const tipY = isSelected ? 80 : 72;

    // Soft drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Outer Halo Circle
    ctx.beginPath();
    ctx.arc(cx, cy, rHalo, 0, Math.PI * 2);
    ctx.fillStyle = haloColor;
    ctx.fill();

    // Downward pointed tip
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy + 6);
    ctx.lineTo(cx, tipY);
    ctx.lineTo(cx + 9, cy + 6);
    ctx.closePath();
    ctx.fillStyle = '#142c18';
    ctx.fill();
    ctx.restore();

    // Subtle contour stroke
    ctx.beginPath();
    ctx.arc(cx, cy, rHalo, 0, Math.PI * 2);
    ctx.strokeStyle = '#bdd073';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Circular Avatar with Customer Profile Picture
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rAvatar, 0, Math.PI * 2);
    ctx.clip();

    if (customerImg && customerImg.complete && customerImg.naturalWidth > 0) {
      try {
        ctx.drawImage(customerImg, cx - rAvatar, cy - rAvatar, rAvatar * 2, rAvatar * 2);
      } catch {
        drawInitialsFallback(ctx, cx, cy, rAvatar, customerInitials);
      }
    } else {
      drawInitialsFallback(ctx, cx, cy, rAvatar, customerInitials);
    }
    ctx.restore();

    // Crisp White Rim
    ctx.beginPath();
    ctx.arc(cx, cy, rAvatar, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Electric Blue Live Status Dot
    const dotX = cx + (isSelected ? 12 : 11);
    const dotY = cy + (isSelected ? 10 : 9);
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0088e8';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Top Capsule Pill
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    const pillH = isSelected ? 18 : 16;
    ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
    const textMetrics = ctx.measureText(priceText);
    const pillW = Math.max(isSelected ? 48 : 44, Math.min(textMetrics.width + 14, 60));
    const pillX = cx - pillW / 2;
    const pillY = 2;
    const pillR = pillH / 2;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
    } else {
      ctx.arc(pillX + pillR, pillY + pillR, pillR, Math.PI / 2, Math.PI * 1.5);
      ctx.arc(pillX + pillW - pillR, pillY + pillR, pillR, Math.PI * 1.5, Math.PI / 2);
      ctx.closePath();
    }
    ctx.fillStyle = haloColor;
    ctx.fill();
    ctx.strokeStyle = '#bdd073';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // Price text inside pill
    ctx.font = 'bold 8.5px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#2c3d14';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(priceText, cx, pillY + pillH / 2 + 0.5);

    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
};

// Web Audio API Synthesizer for incoming dispatch alert chime
const playDispatchChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.45);
  } catch {
    // Audio context not allowed or unsupported
  }
};

// Pool of realistic incoming customer job requests for real-time simulation
const SIMULATED_REQUESTS_POOL = [
  {
    title: 'Emergency Main Breaker Tripping & Spark Diagnostic',
    service_category: { service_name: 'Electrical', icon: 'Zap' },
    budget: '145.00',
    price_badge: 'LKR 145',
    customer: {
      user: {
        name: 'Malsha Senanayake',
        phone: '+94 77 441 2288',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'MS',
      },
    },
    property: {
      address_line: 'No. 28 Duplication Road, Kollupitiya',
      city: 'Colombo 03',
      latitude: 6.9042,
      longitude: 79.8540,
    },
  },
  {
    title: 'Ceiling High-Pressure Water Pipe Leak & Flooding',
    service_category: { service_name: 'Plumbing', icon: 'Droplets' },
    budget: '190.00',
    price_badge: 'LKR 190',
    customer: {
      user: {
        name: 'Tariq Al-Mansoor',
        phone: '+94 71 882 4433',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'TM',
      },
    },
    property: {
      address_line: '52 Gregorys Road, Cinnamon Gardens',
      city: 'Colombo 07',
      latitude: 6.9118,
      longitude: 79.8715,
    },
  },
  {
    title: 'Inverter Air Conditioner Compressor Failure Repair',
    service_category: { service_name: 'HVAC', icon: 'Wind' },
    budget: '230.00',
    price_badge: 'LKR 230',
    customer: {
      user: {
        name: 'Nethmi Wickramatunga',
        phone: '+94 76 559 1100',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'NW',
      },
    },
    property: {
      address_line: '109 Havelock Road, Havelock Town',
      city: 'Colombo 05',
      latitude: 6.8835,
      longitude: 79.8652,
    },
  },
  {
    title: 'Perimeter Smart CCTV & Motion Sensor Setup',
    service_category: { service_name: 'Smart Home', icon: 'Sparkles' },
    budget: '175.00',
    price_badge: 'LKR 175',
    customer: {
      user: {
        name: 'Shehan De Silva',
        phone: '+94 77 993 6611',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
        avatar_initials: 'SS',
      },
    },
    property: {
      address_line: '16 Flower Road, Cinnamon Gardens',
      city: 'Colombo 07',
      latitude: 6.9080,
      longitude: 79.8605,
    },
  },
];

const FALLBACK_TECHNICIANS = [
  {
    id: 1,
    name: 'Ananya Perera',
    specialty: 'HVAC Specialist',
    phone: '+94 71 889 2233',
    rating: '4.9',
    active_jobs: 1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    avatar_initials: 'AP',
    status: 'available',
  },
  {
    id: 2,
    name: 'Liam Chen',
    specialty: 'Master Electrician',
    phone: '+94 76 554 1122',
    rating: '4.8',
    active_jobs: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    avatar_initials: 'LC',
    status: 'available',
  },
  {
    id: 3,
    name: 'Samantha Reed',
    specialty: 'Plumbing Lead',
    phone: '+94 72 331 9900',
    rating: '5.0',
    active_jobs: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    avatar_initials: 'SR',
    status: 'available',
  },
  {
    id: 4,
    name: 'Carlos Mendez',
    specialty: 'Smart Home & Security',
    phone: '+94 77 001 2233',
    rating: '4.7',
    active_jobs: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    avatar_initials: 'CM',
    status: 'available',
  },
];

export default function JobSearch({
  ongoingJobs = [],
  serviceCategories = [],
  technicians = [],
  googleMapsApiKey = '',
  initialOnlineStatus = true,
  filters = {},
}) {
  const { t } = useTranslation();
  const mapRef = useRef(null);

  const effectiveApiKey = googleMapsApiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: effectiveApiKey,
    libraries: MAP_LIBRARIES,
  });

  // Online / Offline Status State
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('company_online_status');
      if (saved !== null) return saved === 'true';
    }
    return initialOnlineStatus;
  });
  const [toast, setToast] = useState(null);

  const handleToggleOnline = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    if (typeof window !== 'undefined') {
      localStorage.setItem('company_online_status', String(nextStatus));
    }

    setToast({
      type: nextStatus ? 'success' : 'default',
      msg: nextStatus
        ? t('Status updated: You are now Online. Ready to receive and dispatch job requests.')
        : t('Status updated: You are now Offline. Job dispatch is currently paused.'),
    });
    setTimeout(() => setToast(null), 3500);

    router.post(
      '/company/jobs/toggle-online',
      { is_online: nextStatus },
      { preserveScroll: true, preserveState: true }
    );
  };

  // UI state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category_id || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [reviewingJob, setReviewingJob] = useState(null);
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [providerSearch, setProviderSearch] = useState('');

  // Simulated requests state
  const [simulatedJobs, setSimulatedJobs] = useState([]);
  const [simulatedIndex, setSimulatedIndex] = useState(0);
  const [pulsingJobId, setPulsingJobId] = useState(null);

  // Parse backend jobs with coordinates or use rich fallback
  const allOngoingJobs = useMemo(() => {
    let baseJobs = [];
    if (Array.isArray(ongoingJobs) && ongoingJobs.length > 0) {
      baseJobs = ongoingJobs.map((job, index) => {
        const prop = job.property || {};
        const fallback = FALLBACK_ONGOING_JOBS[index % FALLBACK_ONGOING_JOBS.length];
        const lat = parseFloat(prop.latitude) || fallback.property.latitude;
        const lng = parseFloat(prop.longitude) || fallback.property.longitude;

        const cust = job.customer || {};
        const custUser = cust.user || {};
        const custName = custUser.name || custUser.full_name || fallback.customer.user.name;
        const custAvatar = custUser.image_url || custUser.profile_image || custUser.avatar || fallback.customer.user.avatar;
        const custInitials = (custName || 'CU')
          .split(' ')
          .filter(Boolean)
          .map((p) => p[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        const isNewJob = job.status === 'pending' || job.status === 'new';

        return {
          id: job.id,
          job_code: `JOB-${job.id}`,
          title: job.title || fallback.title,
          service_category: job.service_category || fallback.service_category,
          status: job.status || (isNewJob ? 'pending' : 'in_progress'),
          sub_status: isNewJob
            ? 'New Request'
            : (job.assignment?.status === 'assigned' ? 'Dispatched' : (fallback.sub_status || 'Working On-Site')),
          budget: job.budget || fallback.budget,
          started_at: fallback.started_at,
          customer: {
            user: {
              name: custName,
              phone: custUser.phone || fallback.customer.user.phone,
              avatar: custAvatar,
              avatar_initials: custInitials,
            },
          },
          property: {
            address_line: prop.address_line || fallback.property.address_line,
            city: prop.city || fallback.property.city,
            latitude: lat,
            longitude: lng,
          },
          technician: job.assignment?.provider?.user
            ? {
                id: job.assignment.provider.id,
                name: job.assignment.provider.user.name,
                phone: job.assignment.provider.user.phone || '+94 77 000 0000',
                specialty: t('Assigned Technician'),
                avatar_initials: job.assignment.provider.user.name.charAt(0),
              }
            : (isNewJob ? null : fallback.technician),
        };
      });
    } else {
      baseJobs = FALLBACK_ONGOING_JOBS;
    }

    // Prepend simulated requests so they appear right at the top
    return [...simulatedJobs, ...baseJobs];
  }, [ongoingJobs, simulatedJobs, t]);

  // Counts for each status chip
  const counts = useMemo(() => {
    let newCount = 0;
    let workingCount = 0;
    let enRouteCount = 0;

    allOngoingJobs.forEach((job) => {
      const isNew =
        job.status === 'pending' ||
        job.status === 'new' ||
        job.sub_status?.toLowerCase().includes('new') ||
        !job.technician?.name;

      if (isNew) {
        newCount++;
      } else if (
        job.sub_status?.toLowerCase().includes('site') ||
        job.sub_status?.toLowerCase().includes('working') ||
        job.sub_status?.toLowerCase().includes('diagnostic') ||
        job.sub_status?.toLowerCase().includes('testing')
      ) {
        workingCount++;
      } else if (
        job.sub_status?.toLowerCase().includes('route') ||
        job.sub_status?.toLowerCase().includes('dispatch')
      ) {
        enRouteCount++;
      }
    });

    return {
      all: allOngoingJobs.length,
      new: newCount,
      working: workingCount,
      enRoute: enRouteCount,
    };
  }, [allOngoingJobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return allOngoingJobs.filter((job) => {
      const titleMatch = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const codeMatch = job.job_code?.toLowerCase().includes(searchTerm.toLowerCase());
      const customerMatch = job.customer?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const techMatch = job.technician?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const addressMatch = job.property?.address_line?.toLowerCase().includes(searchTerm.toLowerCase());

      const searchPassed = !searchTerm || titleMatch || codeMatch || customerMatch || techMatch || addressMatch;

      const categoryPassed =
        selectedCategory === 'all' ||
        String(job.service_category?.id) === String(selectedCategory) ||
        job.service_category?.service_name?.toLowerCase() === selectedCategory.toLowerCase();

      const isNewJob =
        job.status === 'pending' ||
        job.status === 'new' ||
        job.sub_status?.toLowerCase().includes('new') ||
        !job.technician?.name ||
        job.assignment?.status === 'pending';

      const statusPassed =
        statusFilter === 'all' ||
        (statusFilter === 'new' && isNewJob) ||
        (statusFilter === 'working' &&
          (job.sub_status?.toLowerCase().includes('site') ||
            job.sub_status?.toLowerCase().includes('working') ||
            job.sub_status?.toLowerCase().includes('diagnostic') ||
            job.sub_status?.toLowerCase().includes('testing'))) ||
        (statusFilter === 'en route' &&
          (job.sub_status?.toLowerCase().includes('route') ||
            job.sub_status?.toLowerCase().includes('dispatch'))) ||
        job.status?.toLowerCase() === statusFilter.toLowerCase();

      return searchPassed && categoryPassed && statusPassed;
    });
  }, [allOngoingJobs, searchTerm, selectedCategory, statusFilter]);

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      if (filteredJobs.length > 0 && window.google?.maps) {
        try {
          const bounds = new window.google.maps.LatLngBounds();
          filteredJobs.forEach((job) => {
            const lat = Number(job.property?.latitude);
            const lng = Number(job.property?.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              bounds.extend({ lat, lng });
            }
          });
          map.fitBounds(bounds, 70);
        } catch (e) {
          console.warn('Map fitBounds notice:', e);
        }
      }
    },
    [filteredJobs]
  );

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: job.property.latitude,
        lng: job.property.longitude,
      });
      mapRef.current.setZoom(15);
    }
  };

  const handleSimulateRequest = () => {
    // 1. Play dispatch incoming audio alert
    playDispatchChime();

    // 2. Pick next sample request from the simulation pool
    const sample = SIMULATED_REQUESTS_POOL[simulatedIndex % SIMULATED_REQUESTS_POOL.length];
    setSimulatedIndex((prev) => prev + 1);

    const newJobId = 9000 + (Date.now() % 1000);
    const newJob = {
      id: newJobId,
      job_code: `REQ-${String(newJobId).slice(-4)}`,
      title: sample.title,
      service_category: sample.service_category,
      status: 'pending',
      sub_status: 'New Request',
      budget: sample.budget,
      price_badge: sample.price_badge,
      started_at: t('Just now'),
      customer: sample.customer,
      property: sample.property,
      technician: null,
    };

    // 3. Prepend into simulated requests and select it
    setSimulatedJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
    setStatusFilter('new');
    setIsSidebarOpen(true);
    setPulsingJobId(newJobId);

    // Auto-clear radar pulse after 7 seconds
    setTimeout(() => {
      setPulsingJobId((current) => (current === newJobId ? null : current));
    }, 7000);

    // 4. Ensure status is online
    if (!isOnline) {
      setIsOnline(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('company_online_status', 'true');
      }
    }

    // 5. Toast announcement
    setToast({
      type: 'success',
      msg: `${t('⚡ New Job Request Received!')} ${sample.title} (${sample.property.city})`,
    });
    setTimeout(() => setToast(null), 4500);

    // 6. Smooth Animated Navigation to Job Location
    if (mapRef.current) {
      const lat = Number(sample.property.latitude);
      const rawLng = Number(sample.property.longitude);
      // On desktop, the drawer is open on the left (~384px), so offset lng slightly so marker is visually centered in the viewable map canvas
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
      const targetLng = isDesktop ? rawLng - 0.0035 : rawLng;

      mapRef.current.panTo({ lat, lng: targetLng });

      // Stepped zoom animation for aerial cinematic zoom-in
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setZoom(15);
        }
      }, 250);

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setZoom(16);
        }
      }, 600);
    }
  };

  const availableProviders = useMemo(() => {
    if (Array.isArray(technicians) && technicians.length > 0) {
      return technicians.map((tech) => {
        const u = tech.user || {};
        const name = u.name || u.full_name || 'Staff Specialist';
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        return {
          id: tech.id,
          name,
          specialty: tech.specialty || tech.skills || t('Field Technician'),
          phone: u.phone || '+94 77 000 0000',
          rating: '4.9',
          active_jobs: 0,
          avatar: u.image_url || u.profile_image || u.avatar || null,
          avatar_initials: initials,
          status: tech.availability || 'available',
        };
      });
    }
    return FALLBACK_TECHNICIANS;
  }, [technicians, t]);

  const filteredProviders = useMemo(() => {
    if (!providerSearch) return availableProviders;
    const q = providerSearch.toLowerCase();
    return availableProviders.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [availableProviders, providerSearch]);

  const handleOpenAssignDrawer = (job) => {
    setSelectedProviderId(job?.technician?.id ? String(job.technician.id) : '');
    setProviderSearch('');
    setIsAssignDrawerOpen(true);
  };

  const handleAssignProvider = () => {
    if (!selectedProviderId || !reviewingJob) return;

    const chosenProvider = availableProviders.find(
      (p) => String(p.id) === String(selectedProviderId)
    );
    if (!chosenProvider) return;

    const updatedTech = {
      id: chosenProvider.id,
      name: chosenProvider.name,
      specialty: chosenProvider.specialty,
      phone: chosenProvider.phone,
      avatar: chosenProvider.avatar,
      avatar_initials: chosenProvider.avatar_initials,
    };

    const updatedJob = {
      ...reviewingJob,
      technician: updatedTech,
      status: 'assigned',
      sub_status: 'Dispatched',
    };

    setReviewingJob(updatedJob);
    if (selectedJob?.id === reviewingJob.id) {
      setSelectedJob(updatedJob);
    }

    setSimulatedJobs((prev) =>
      prev.map((j) => (j.id === reviewingJob.id ? updatedJob : j))
    );

    if (reviewingJob.id < 9000) {
      router.post(
        `/company/jobs/${reviewingJob.id}/assign-technician`,
        { provider_id: chosenProvider.id },
        { preserveScroll: true, preserveState: true }
      );
    }

    setIsAssignDrawerOpen(false);

    setToast({
      type: 'success',
      msg: `${t('Provider Assigned:')} ${chosenProvider.name} ${t('dispatched to')} ${reviewingJob.job_code}`,
    });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRecenter = () => {
    if (mapRef.current && window.google?.maps && filteredJobs.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      filteredJobs.forEach((j) => {
        bounds.extend({ lat: j.property.latitude, lng: j.property.longitude });
      });
      mapRef.current.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: isSidebarOpen ? 340 : 80 });
    }
  };

  const getCategoryColor = (categoryName = '') => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('plumb')) return { bg: '#0284c7', border: '#0369a1', badge: 'bg-sky-50 text-sky-700 border-sky-200' };
    if (cat.includes('elect')) return { bg: '#d97706', border: '#b45309', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (cat.includes('hvac') || cat.includes('air')) return { bg: '#0f766e', border: '#115e59', badge: 'bg-teal-50 text-teal-700 border-teal-200' };
    if (cat.includes('clean') || cat.includes('renov')) return { bg: '#059669', border: '#047857', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    return { bg: '#0f4a2d', border: '#0a341f', badge: 'bg-emerald-50 text-[#0f4a2d] border-emerald-200' };
  };

  const getCategoryIconComponent = (categoryName = '') => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('plumb')) return <Droplets className="w-3.5 h-3.5 text-sky-600" />;
    if (cat.includes('elect')) return <Zap className="w-3.5 h-3.5 text-amber-600" />;
    if (cat.includes('hvac') || cat.includes('air')) return <Wind className="w-3.5 h-3.5 text-teal-600" />;
    return <Wrench className="w-3.5 h-3.5 text-slate-600" />;
  };

  // State for dynamically loaded customer pin data URLs
  const [pinDataUrls, setPinDataUrls] = useState({});

  useEffect(() => {
    filteredJobs.forEach((job) => {
      const avatarUrl = job.customer?.user?.avatar;
      if (!avatarUrl || AVATAR_IMAGE_CACHE.has(avatarUrl)) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = avatarUrl;
      img.onload = () => {
        AVATAR_IMAGE_CACHE.set(avatarUrl, img);
        const initials = job.customer?.user?.avatar_initials || 'CU';
        const price = job.price_badge || `LKR ${job.budget ? Math.round(Number(job.budget)) : 65}`;

        setPinDataUrls((prev) => ({
          ...prev,
          [job.id]: {
            normal: renderCustomerPinCanvas(img, initials, price, false),
            selected: renderCustomerPinCanvas(img, initials, price, true),
          },
        }));
      };
      img.onerror = () => {
        AVATAR_IMAGE_CACHE.set(avatarUrl, null);
      };
    });
  }, [filteredJobs]);

  const getPinDataUrlForJob = useCallback(
    (job, isSelected = false) => {
      const key = isSelected ? 'selected' : 'normal';
      if (pinDataUrls[job.id]?.[key]) {
        return pinDataUrls[job.id][key];
      }

      const avatarUrl = job.customer?.user?.avatar;
      const cachedImg = avatarUrl ? AVATAR_IMAGE_CACHE.get(avatarUrl) : null;
      const initials = job.customer?.user?.avatar_initials || 'CU';
      const price = job.price_badge || `LKR ${job.budget ? Math.round(Number(job.budget)) : 65}`;

      if (typeof document !== 'undefined') {
        const dataUrl = renderCustomerPinCanvas(cachedImg, initials, price, isSelected);
        if (dataUrl) return dataUrl;
      }

      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        getCustomerPinFallbackSvg({
          customerInitials: initials,
          priceText: price,
          isSelected,
        })
      )}`;
    },
    [pinDataUrls]
  );

  const getProviderPinIcon = useCallback(
    (job, isSelected = false) => {
      const dataUrl = getPinDataUrlForJob(job, isSelected);
      const w = isSelected ? 68 : 60;
      const h = isSelected ? 84 : 76;
      const anchorY = isSelected ? 80 : 72;
      const anchorX = w / 2;

      return {
        url: dataUrl,
        scaledSize:
          typeof window !== 'undefined' && window.google?.maps?.Size
            ? new window.google.maps.Size(w, h)
            : undefined,
        anchor:
          typeof window !== 'undefined' && window.google?.maps?.Point
            ? new window.google.maps.Point(anchorX, anchorY)
            : undefined,
      };
    },
    [getPinDataUrlForJob]
  );

  return (
    <AppLayout>
      <Head title={t('Ongoing Jobs Map')} />

      {/* Full-Page Map Container */}
      <div
        className="relative w-[calc(100%+3rem)] -m-6 overflow-hidden bg-slate-100 flex flex-col flex-1"
        style={{ height: 'calc(100vh - 5.5rem)', minHeight: '600px' }}
      >
        {/* Google Map / Fallback */}
        <div className="absolute inset-0 z-0 w-full h-full" style={{ minHeight: '600px' }}>
          {isLoaded && !loadError ? (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={DEFAULT_CENTER}
              zoom={13}
              onLoad={onMapLoad}
              options={{
                styles: MAP_STYLES,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
            >
              {filteredJobs.map((job, idx) => {
                const isSelected = selectedJob?.id === job.id;

                return (
                  <Marker
                    key={job.id}
                    position={{
                      lat: Number(job.property.latitude),
                      lng: Number(job.property.longitude),
                    }}
                    onClick={() => handleSelectJob(job)}
                    icon={getProviderPinIcon(job, isSelected)}
                    zIndex={isSelected ? 999 : 100 + idx}
                  />
                );
              })}

              {pulsingJobId && selectedJob && selectedJob.id === pulsingJobId && (
                <Circle
                  center={{
                    lat: Number(selectedJob.property.latitude),
                    lng: Number(selectedJob.property.longitude),
                  }}
                  radius={130}
                  options={{
                    fillColor: '#f59e0b',
                    fillOpacity: 0.25,
                    strokeColor: '#d97706',
                    strokeOpacity: 0.85,
                    strokeWeight: 2,
                    clickable: false,
                  }}
                />
              )}

              {selectedJob && (
                <InfoWindow
                  position={{
                    lat: selectedJob.property.latitude,
                    lng: selectedJob.property.longitude,
                  }}
                  onCloseClick={() => setSelectedJob(null)}
                >
                  <div className="p-1 max-w-xs text-slate-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        {selectedJob.sub_status || t('Ongoing')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold ml-auto">
                        {selectedJob.job_code}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {selectedJob.title}
                    </h4>

                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                      {/* Customer with Profile Picture */}
                      <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                        {selectedJob.customer?.user?.avatar ? (
                          <img
                            src={selectedJob.customer.user.avatar}
                            alt={selectedJob.customer.user.name}
                            className="w-7 h-7 rounded-full object-cover border border-white shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#0f4a2d] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                            {selectedJob.customer?.user?.avatar_initials || 'C'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                            {t('Customer')}
                          </span>
                          <span className="font-bold text-xs text-slate-800 truncate block">
                            {selectedJob.customer?.user?.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 px-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{selectedJob.property?.address_line}</span>
                      </div>
                      {selectedJob.technician && (
                        <div className="flex items-center gap-1.5 text-[#0f4a2d] font-semibold px-1 pt-0.5">
                          <Wrench className="w-3 h-3 text-[#0f4a2d] shrink-0" />
                          <span>{selectedJob.technician.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            /* Fallback Interactive Visual Map when API Key is missing or loading */
            <div className="relative w-full h-full bg-gradient-to-br from-slate-100 via-emerald-50/20 to-sky-50 flex items-center justify-center p-6 overflow-hidden">
              {/* Map grid lines simulation */}
              <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    'radial-gradient(#0f4a2d 1px, transparent 1px), radial-gradient(#0f4a2d 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                  backgroundPosition: '0 0, 14px 14px',
                }}
              />

              {/* Sri Lanka / Urban road network simulation */}
              <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50,200 Q400,180 800,320 T1600,450" fill="none" stroke="#cbd5e1" strokeWidth="6" />
                <path d="M200,-50 Q350,400 450,900" fill="none" stroke="#cbd5e1" strokeWidth="5" />
                <path d="M600,-50 Q550,500 700,900" fill="none" stroke="#94a3b8" strokeWidth="7" />
                <path d="M100,500 Q500,600 1200,400" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                <path d="M300,100 L900,700" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,6" />
              </svg>

              {/* Simulated job markers on canvas using same ProviderPin */}
              {filteredJobs.map((job, idx) => {
                const isSelected = selectedJob?.id === job.id;
                const posX = 38 + ((idx * 17) % 52);
                const posY = 25 + ((idx * 19) % 55);

                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJob(job)}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-[90%] cursor-pointer transition-all duration-200 z-10 ${
                      isSelected ? 'scale-115 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <img
                      src={getPinDataUrlForJob(job, isSelected)}
                      alt={job.customer?.user?.name || job.title}
                      className={isSelected ? 'w-[68px] h-[84px]' : 'w-[60px] h-[76px]'}
                    />
                  </div>
                );
              })}

              {/* Watermark / subtle notice */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 font-medium shadow-xs">
                {t('Ongoing Jobs Radar • Interactive Dispatch')}
              </div>
            </div>
          )}
        </div>

        {/* Floating Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pointer-events-none">
          {/* Search & Filter Capsule */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-2 flex flex-wrap md:flex-nowrap items-center gap-2 max-w-3xl flex-1">
            {/* Drawer Toggle */}
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              title={isSidebarOpen ? t('Collapse Jobs Drawer') : t('Expand Jobs Drawer')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-[#0f4a2d] hover:text-white text-slate-700 transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Search ongoing jobs by ID, customer, address, or technician...')}
                className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0f4a2d]/20 focus:border-[#0f4a2d] transition-all bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f4a2d]/20 focus:border-[#0f4a2d] transition-all"
            >
              <option value="all">{t('All Categories')}</option>
              {serviceCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.service_name}
                </option>
              ))}
              {serviceCategories.length === 0 && (
                <>
                  <option value="HVAC">{t('HVAC')}</option>
                  <option value="Electrical">{t('Electrical')}</option>
                  <option value="Plumbing">{t('Plumbing')}</option>
                  <option value="Smart Home">{t('Smart Home')}</option>
                </>
              )}
            </select>

            {/* Recenter Button */}
            <button
              onClick={handleRecenter}
              title={t('Recenter Map')}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Compass className="w-4 h-4 text-[#0f4a2d]" />
              <span className="hidden sm:inline">{t('Center')}</span>
            </button>
          </div>

          {/* Top Right Cluster: Simulate Request, Online/Offline Toggle & Live Active Count */}
          <div className="pointer-events-auto flex items-center gap-2.5 self-start md:self-auto">
            {/* Simulate Request Button */}
            <button
              type="button"
              onClick={handleSimulateRequest}
              title={t('Simulate an incoming real-time customer job request with map animation')}
              className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 hover:from-amber-600 hover:to-emerald-800 text-white rounded-2xl shadow-lg border border-amber-300/60 px-3.5 py-2 flex items-center gap-2 text-xs font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform" />
              <span>{t('Simulate Request')}</span>
            </button>

            {/* Online / Offline Toggle Pill */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 px-3.5 py-1.5 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {isOnline ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-400" />
                  )}
                </span>
                <span
                  className={`text-xs font-extrabold tracking-tight select-none transition-colors ${
                    isOnline ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {isOnline ? t('Online') : t('Offline')}
                </span>
              </div>

              {/* Interactive Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isOnline}
                onClick={handleToggleOnline}
                title={isOnline ? t('Click to go Offline') : t('Click to go Online')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0f4a2d]/30 ${
                  isOnline ? 'bg-[#0f4a2d]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isOnline ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Live Count Pill */}
            <div className="hidden sm:flex bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 px-3.5 py-2 items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {filteredJobs.length} {t('Ongoing Jobs Active')}
              </span>
            </div>
          </div>
        </div>

        {/* Offline Mode Banner when toggled off */}
        {!isOnline && (
          <div className="absolute top-20 right-4 z-20 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-amber-600/95 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-2xl shadow-lg border border-amber-400/50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{t('Offline Mode • New incoming customer requests are paused')}</span>
            </div>
          </div>
        )}

        {/* Floating Left Drawer - Ongoing Jobs List */}
        <div
          className={`absolute top-20 bottom-4 left-4 z-20 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
            isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[110%] opacity-0 pointer-events-none'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0f4a2d]/10 flex items-center justify-center text-[#0f4a2d]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-none">
                  {t('Ongoing Jobs')}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {t('Live workforce tracking')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status Chips */}
          <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-[#0f4a2d] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t('All')} ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all inline-flex items-center gap-1.5 shrink-0 ${
                statusFilter === 'new'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {t('New Requests')} ({counts.new})
            </button>
            <button
              onClick={() => setStatusFilter('working')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 ${
                statusFilter === 'working'
                  ? 'bg-[#0f4a2d] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t('On-Site')} ({counts.working})
            </button>
            <button
              onClick={() => setStatusFilter('en route')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 ${
                statusFilter === 'en route'
                  ? 'bg-[#0f4a2d] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t('En Route')} ({counts.enRoute})
            </button>
          </div>

          {/* Jobs List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const isPulsing = job.id === pulsingJobId;
              const colorConfig = getCategoryColor(job.service_category?.service_name);
              const isNewRequest = job.status === 'pending' || job.sub_status?.toLowerCase().includes('new') || !job.technician?.name;

              return (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isPulsing
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400 shadow-md animate-pulse'
                      : isSelected
                      ? 'border-[#0f4a2d] bg-emerald-50/70 shadow-sm ring-1 ring-[#0f4a2d]'
                      : isNewRequest
                      ? 'border-amber-200/90 bg-amber-50/30 hover:bg-amber-50/60 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:bg-slate-50/80 shadow-xs'
                  }`}
                >
                  {/* Top info */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorConfig.badge}`}>
                      {getCategoryIconComponent(job.service_category?.service_name)}
                      {job.service_category?.service_name || t('General')}
                    </span>

                    {isNewRequest ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {t('New Request')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {job.sub_status}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {job.title}
                  </h4>

                  {/* Customer & Location */}
                  <div className="mt-2 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {job.customer?.user?.avatar ? (
                        <img
                          src={job.customer.user.avatar}
                          alt={job.customer.user.name}
                          className="w-4 h-4 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#0f4a2d]/10 text-[#0f4a2d] flex items-center justify-center font-bold text-[8px] shrink-0">
                          {job.customer?.user?.avatar_initials || 'C'}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800 truncate">{job.customer?.user?.name}</span>
                      <span className="text-slate-400 text-[10px] ml-auto shrink-0">{job.job_code}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{job.property?.address_line}</span>
                    </div>
                  </div>

                  {/* Technician & Elapsed Info */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    {job.technician?.name ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#0f4a2d]/10 text-[#0f4a2d] flex items-center justify-center font-bold text-[10px]">
                          {job.technician?.avatar_initials || 'T'}
                        </div>
                        <span className="font-bold text-slate-800">
                          {job.technician.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {t('Awaiting Dispatch')}
                        </span>
                        <Link
                          href={`/company/jobs/assignments?job_id=${job.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 rounded-md bg-[#0f4a2d] hover:bg-[#0a341f] text-white font-bold text-[10px] shadow-xs transition-colors"
                        >
                          {t('Dispatch')}
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>{job.started_at}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="p-8 text-center">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">{t('No ongoing jobs found')}</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Try adjusting your search terms or filters.')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Job Floating Detail Card (Bottom Center/Right) */}
        {selectedJob && (
          <div className="absolute bottom-4 right-4 z-20 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/90 p-5 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                {selectedJob.status === 'pending' || selectedJob.sub_status?.toLowerCase().includes('new') || !selectedJob.technician?.name ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {t('New Request')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {selectedJob.sub_status}
                  </span>
                )}
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {selectedJob.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 my-3">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  {selectedJob.customer?.user?.avatar ? (
                    <img
                      src={selectedJob.customer.user.avatar}
                      alt={selectedJob.customer.user.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">
                      {selectedJob.customer?.user?.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{selectedJob.customer?.user?.phone}</span>
                  </div>
                </div>
                <a
                  href={`tel:${selectedJob.customer?.user?.phone}`}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0f4a2d] transition-colors"
                  title={t('Call Customer')}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>

              {selectedJob.technician?.name ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-[#0f4a2d]" />
                    <div>
                      <span className="font-bold text-[#0f4a2d] block text-[11px]">
                        {selectedJob.technician.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{selectedJob.technician?.specialty}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${selectedJob.technician?.phone}`}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0f4a2d] transition-colors"
                    title={t('Call Technician')}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <div>
                      <span className="font-bold text-amber-900 block text-[11px]">
                        {t('Awaiting Technician Dispatch')}
                      </span>
                      <span className="text-[10px] text-amber-700">{t('Specialist unassigned')}</span>
                    </div>
                  </div>
                  <Link
                    href={`/company/jobs/assignments?job_id=${selectedJob.id}`}
                    className="px-2.5 py-1 rounded-lg bg-[#0f4a2d] text-white font-bold text-xs shadow-xs hover:bg-[#0a341f] transition-colors"
                  >
                    {t('Dispatch')}
                  </Link>
                </div>
              )}

              <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedJob.property?.address_line}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                {t('Close Detail')}
              </button>

              <button
                type="button"
                onClick={() => setReviewingJob(selectedJob)}
                className="px-4 py-2 rounded-xl bg-[#0f4a2d] hover:bg-[#0a341f] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:shadow-md cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('Review Request')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Redesigned Job Details Modal (Inspired by Provider Mobile App) */}
      {reviewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-100 rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative">
            {/* 1. Mobile App Inspired Olive Green Top Header */}
            <div className="bg-gradient-to-br from-[#283719] via-[#354822] to-[#3d5228] text-white p-5 sm:p-6 relative shrink-0 shadow-md">
              <div className="flex items-center justify-between gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setReviewingJob(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
                  title={t('Close')}
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  {t('Job Details')}
                </h3>

                <span className="px-3 py-1 rounded-full bg-white text-orange-600 font-black text-xs shadow-xs tracking-wide">
                  {reviewingJob.technician?.name ? t('Dispatched') : t('Needs Quote')}
                </span>
              </div>

              {/* Subheader info line */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-lime-100/90 flex-wrap mt-2">
                <span className="font-black text-lime-300">{reviewingJob.job_code}</span>
                <span className="text-white/40">•</span>
                <span className="font-bold text-white">
                  {reviewingJob.service_category?.service_name || t('Plumbing')}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">{reviewingJob.property?.city || t('Colombo')}</span>
                <span className="text-white/60 text-xs ml-auto font-medium">
                  {t('2.4 km away')}
                </span>
              </div>

              {/* Company Work Order Tag Pill */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-lime-200 text-xs font-semibold backdrop-blur-xs">
                <Building2 className="w-3.5 h-3.5 text-lime-300 shrink-0" />
                <span>{t('Company Dispatched • Apex Home Solutions Pvt Ltd')}</span>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin bg-slate-50/70">
              {/* 2. Company Work Order & Dispatch Note (Dark Banner) */}
              <div className="bg-[#1c2016] text-white rounded-3xl p-4 sm:p-5 border border-[#2f3824] shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#2d3620] text-lime-300">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Apex Home Solutions Pvt Ltd</span>
                        <span className="bg-[#d2e87c] text-[#1c2e0e] font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {t('STAFF DISPATCH')}
                        </span>
                      </div>
                      <span className="text-xs text-lime-100/70 font-medium">
                        {t('Assigned Company Work Order')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#242b1d] rounded-2xl p-3.5 border border-[#354026] text-xs text-lime-100/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-lime-300">
                    <Info className="w-3.5 h-3.5" />
                    <span>{t('Dispatch Note')}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed">
                    {t(
                      'This work order has been routed to your company dispatch console. Assign an authorized staff specialist to execute standard quoting and service milestones. Client payment will be credited to company account.'
                    )}
                  </p>
                </div>
              </div>

              {/* 3. Job Stage Progress (5-Stage Stepper) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">
                      {t('Job Stage Progress')}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    {t('Auto • Step 1/4')}
                  </span>
                </div>

                {/* Stepper Graphic */}
                <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center pt-1">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-orange-500/25 ring-2 ring-orange-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 mt-1.5">
                      {t('To Quote')}
                    </span>
                    <span className="text-[9px] font-extrabold text-orange-700/80">
                      {t('Active')}
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center opacity-70">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 mt-1.5 truncate max-w-full">
                      {t('Pending app...')}
                    </span>
                    <span className="text-[9px] text-slate-400">{t('Pending')}</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center opacity-70">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 mt-1.5 truncate max-w-full">
                      {t('To Start')}
                    </span>
                    <span className="text-[9px] text-slate-400">{t('Pending')}</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center opacity-70">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 mt-1.5 truncate max-w-full">
                      {t('Ongoing')}
                    </span>
                    <span className="text-[9px] text-slate-400">{t('Pending')}</span>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-col items-center opacity-70">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs">
                      5
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 mt-1.5 truncate max-w-full">
                      {t('Finished')}
                    </span>
                    <span className="text-[9px] text-slate-400">{t('Pending')}</span>
                  </div>
                </div>

                {/* Stage 1 Action Box */}
                <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 sm:p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-amber-100 text-amber-800">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-xs text-amber-900">
                        {t('Stage 1: Quotation & Dispatch Pending')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      {t('Action Required')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t(
                      'Review customer request and assign an available technician specialist. Dispatching your staff will automatically advance this job to Active In-Progress.'
                    )}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('Action: Assign specialist technician below')}</span>
                  </div>
                </div>
              </div>

              {/* 4. Scheduled Booking Card (Blue Theme) */}
              <div className="bg-sky-50/60 border border-sky-100 rounded-3xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-sky-950 block">
                        {t('SCHEDULED BOOKING')}
                      </span>
                      <span className="text-[11px] text-sky-700/80">
                        {t('Future date & time appointment confirmed')}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('Booked')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white rounded-2xl p-3 border border-sky-100/90 space-y-1 shadow-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar className="w-3 h-3 text-sky-600" />
                      <span>{t('Scheduled Date')}</span>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {t('Tuesday, 27 Oct 2026')}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 border border-sky-100/90 space-y-1 shadow-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3 text-sky-600" />
                      <span>{t('Time Window')}</span>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      04:30 PM ({t('Flexible')})
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-2.5 border border-sky-100/80 flex items-center justify-between text-xs text-sky-900">
                  <span className="flex items-center gap-1.5 font-bold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    {t('Scheduled for Tomorrow')}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 text-[10px] font-extrabold">
                    {t('+ Add Reminder')}
                  </span>
                </div>
              </div>

              {/* 5. Customer Information & Location Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xs">
                <h4 className="font-extrabold text-sm text-slate-900">
                  {t('Customer Information')}
                </h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {reviewingJob.customer?.user?.avatar ? (
                      <img
                        src={reviewingJob.customer.user.avatar}
                        alt={reviewingJob.customer.user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#0f4a2d] text-white flex items-center justify-center font-black text-sm shrink-0">
                        {reviewingJob.customer?.user?.avatar_initials || 'SK'}
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900">
                        {reviewingJob.customer?.user?.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {reviewingJob.customer?.user?.phone || t('Verified Customer')}
                      </div>
                    </div>
                  </div>

                  {/* Mobile App Style Circular Call and Message Action Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${reviewingJob.customer?.user?.phone}`}
                      className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-all shadow-xs"
                      title={t('Call Customer')}
                    >
                      <Phone className="w-4 h-4 text-emerald-700" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = `mailto:${reviewingJob.customer?.user?.email || 'customer@example.com'}`;
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center transition-all shadow-xs"
                      title={t('Message Customer')}
                    >
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Service Location Address Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#0f4a2d]" />
                    <span>{t('Service Location Address')}</span>
                  </div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                    {reviewingJob.property?.address_line}, {reviewingJob.property?.city}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t('Distance: 2.4 km away from your central dispatch depot')}
                  </div>
                </div>

                {/* Interactive Google Map Preview Container */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-40 sm:h-44 w-full shadow-inner">
                  {isLoaded && !loadError ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={{
                        lat: Number(reviewingJob.property?.latitude) || DEFAULT_CENTER.lat,
                        lng: Number(reviewingJob.property?.longitude) || DEFAULT_CENTER.lng,
                      }}
                      zoom={15}
                      options={{
                        styles: MAP_STYLES,
                        disableDefaultUI: true,
                        zoomControl: false,
                        scrollwheel: false,
                        gestureHandling: 'none',
                        draggable: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      <Marker
                        position={{
                          lat: Number(reviewingJob.property?.latitude) || DEFAULT_CENTER.lat,
                          lng: Number(reviewingJob.property?.longitude) || DEFAULT_CENTER.lng,
                        }}
                      />
                    </GoogleMap>
                  ) : (
                    /* Fallback when Google Maps script is loading or unavailable */
                    <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            'radial-gradient(#0f4a2d 1px, transparent 1px), radial-gradient(#0f4a2d 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                          backgroundPosition: '0 0, 8px 8px',
                        }}
                      />
                      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20,90 Q150,20 300,70 T600,30" fill="none" stroke="#0f4a2d" strokeWidth="4" />
                        <circle cx="20" cy="90" r="4" fill="#0f4a2d" />
                        <circle cx="300" cy="70" r="6" fill="#dc2626" />
                      </svg>
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-200 animate-ping" />
                      </div>
                    </div>
                  )}

                  {/* Top Left Distance Tag */}
                  <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5 pointer-events-none">
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t('2.4 km away • ~8 mins')}</span>
                  </div>

                  {/* Bottom Right Get Directions Button */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${reviewingJob.property?.latitude || 6.8985},${reviewingJob.property?.longitude || 79.8558}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2.5 right-2.5 z-10 bg-slate-900/90 hover:bg-slate-950 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('Get Directions')}</span>
                  </a>
                </div>
              </div>

              {/* 6. Service Scope & Request */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-2.5 shadow-xs">
                <h4 className="font-extrabold text-sm text-slate-900">
                  {t('Service Scope & Request')}
                </h4>
                <div className="font-extrabold text-sm text-slate-900">
                  {reviewingJob.title}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(
                    'Need full diagnostic inspection and authorized specialist service for residential plumbing and electrical maintenance. Client requested immediate response upon quotation.'
                  )}
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {t('Inspection Today • 04:30 PM')}
                  </span>
                </div>
              </div>

              {/* 7. Payment Method & Protection */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {t('Payment Method')}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t('Pay on Completion')}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-xs text-slate-900">
                    {t('Cash on Delivery / Direct Invoicing')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t('Collect payment directly from customer upon finishing or direct charge to company corporate billing.')}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('HandyGig Payment Protection: Verified provider payout guaranteed.')}</span>
                </div>
              </div>

              {/* 8. Technician Assignment Status */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-2 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  {t('Assigned Specialist')}
                </span>
                {reviewingJob.technician?.name ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0f4a2d]/10 text-[#0f4a2d] flex items-center justify-center font-bold text-xs">
                        {reviewingJob.technician.avatar_initials || 'T'}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-800">
                          {reviewingJob.technician.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {reviewingJob.technician.specialty}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${reviewingJob.technician.phone}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <span>{t('Awaiting Specialist Assignment • No technician assigned yet')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 9. Mobile-App Style Sticky Footer Bar */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 border-t border-slate-200/90 flex items-center justify-between gap-3 shadow-lg shrink-0">
              <button
                type="button"
                onClick={() => setReviewingJob(null)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <X className="w-4 h-4 text-rose-500" />
                <span>{t('Decline')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAssignDrawer(reviewingJob)}
                className="flex-1 sm:flex-initial px-7 py-2.5 rounded-2xl bg-[#3d5228] hover:bg-[#2e3e1d] text-white text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserCheck className="w-4 h-4 text-lime-300" />
                <span>
                  {reviewingJob.technician?.name
                    ? t('Reassign Provider')
                    : t('Assign a Provider')}
                </span>
              </button>
            </div>

            {/* Slide-over Assign Provider Drawer inside the popped up modal */}
            {isAssignDrawerOpen && (
              <div className="absolute inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
                <div className="w-full sm:w-[440px] h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
                  {/* Drawer Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#3d5228]/10 text-[#3d5228]">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">
                          {t('Assign a Provider')}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold truncate max-w-[240px]">
                          {reviewingJob.job_code} • {reviewingJob.title}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAssignDrawerOpen(false)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="p-4 border-b border-slate-100 bg-white">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={providerSearch}
                        onChange={(e) => setProviderSearch(e.target.value)}
                        placeholder={t('Search available staff by name or specialty...')}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d5228]/20 focus:border-[#3d5228] transition-all"
                      />
                    </div>
                  </div>

                  {/* Providers List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">
                      {t('Available Staff Specialists')} ({filteredProviders.length})
                    </div>

                    {filteredProviders.map((provider) => {
                      const isSelected = String(selectedProviderId) === String(provider.id);
                      return (
                        <div
                          key={provider.id}
                          onClick={() => setSelectedProviderId(provider.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-[#3d5228] bg-[#3d5228]/5 ring-2 ring-[#3d5228]/30 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {provider.avatar ? (
                              <img
                                src={provider.avatar}
                                alt={provider.name}
                                className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-[#3d5228] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {provider.avatar_initials}
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                                  {provider.name}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  {t('Available')}
                                </span>
                              </div>

                              <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                {provider.specialty}
                              </div>

                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {provider.phone}
                              </div>
                            </div>
                          </div>

                          <input
                            type="radio"
                            name="providerSelectRadio"
                            checked={isSelected}
                            onChange={() => setSelectedProviderId(provider.id)}
                            className="accent-[#3d5228] w-4 h-4 ml-3 cursor-pointer shrink-0"
                          />
                        </div>
                      );
                    })}

                    {filteredProviders.length === 0 && (
                      <div className="p-8 text-center text-slate-500">
                        <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">{t('No providers found')}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{t('Try searching with a different term.')}</p>
                      </div>
                    )}
                  </div>

                  {/* Drawer Sticky Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsAssignDrawerOpen(false)}
                      className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-200/60 text-xs font-bold transition-colors"
                    >
                      {t('Cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleAssignProvider}
                      disabled={!selectedProviderId}
                      className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-sm ${
                        selectedProviderId
                          ? 'bg-[#3d5228] hover:bg-[#2e3e1d] text-white hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('Confirm Assignment')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <FloatingToast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}
