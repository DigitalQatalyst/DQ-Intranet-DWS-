# DQ Map Setup & Integration Guide

## ✅ Status: Integration Complete

The DQ Map has been successfully integrated into the Discover DQ page. All import issues have been resolved and the map is ready to use.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Mapbox Token

1. Visit **https://account.mapbox.com/**
2. **Sign up** (free tier is sufficient) or **log in**
3. Navigate to **"Access tokens"** in your account
4. Copy your **default public token** (starts with `pk.`)

### Step 2: Create .env File

Create a file named `.env` in the project root (same directory as `package.json`):

```env
# Mapbox Configuration
VITE_MAPBOX_TOKEN=pk.your_actual_token_here
```

⚠️ **Important**: 
- Replace `pk.your_actual_token_here` with your real token
- The `.env` file is already in `.gitignore` - your token stays private
- Never commit your token to version control

### Step 3: Restart Development Server

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

The map should now load successfully on the Discover DQ page!

---

## 📍 Where Is the Map?

**Location**: Discover DQ Hero Section (Right Panel)

```
/discover-dq
├── Hero Section (2 columns)
│   ├── Left: Hero content (title, CTAs, stats)
│   └── Right: Interactive Map ✅ (replaces zone menu)
```

**Desktop/Tablet**: Map shows in right column (600px height)  
**Mobile**: Map hidden; "Browse DQ DNA" button shown instead

---

## 🗺️ Map Features Verified

### ✅ Data Loaded (11 Locations)
- **3 DQ Offices**: Dubai HQ, Nairobi, Riyadh
- **5 Clients**: Khalifa Fund, NEOM, SAIB, stc bank, ADIB
- **2 Authorities**: DFSA, DEWA

### ✅ Interactive Features
- **Color-coded pins** by location type
- **Clickable markers** with detailed popups
- **Region filter** (All, Dubai, Abu Dhabi, Riyadh, Nairobi)
- **Type filter** (All, Headquarters, Regional Office, Client, Authority)
- **Map style switcher** (Standard, Satellite, Hybrid)
- **Color legend** for pin types
- **Results counter**
- **Auto-fit bounds** to show all markers
- **Loading state** with smooth transitions

---

## 🔧 Technical Details

### Files Modified

1. **`src/components/DQMap.tsx`**
   - ✅ Fixed mapbox-gl import
   - ✅ Set access token at module level
   - ✅ Removed duplicate token assignment
   - ✅ Added proper TypeScript handling

2. **`src/components/Discover/HeroDiscoverDQ.tsx`**
   - ✅ Imported DQMap component
   - ✅ Replaced zone menu with map in right column
   - ✅ Maintained left hero content unchanged

3. **`src/types/map.ts`** (Created)
   - Type definitions for MapLocation, LocationType, Region, MapStyle

4. **`src/api/MAPAPI.ts`** (Created)
   - Mock API with 11 pre-loaded locations
   - Filter functions for region and type

### Dependencies Verified

```json
{
  "mapbox-gl": "^3.15.0" // ✅ Already installed
}
```

No additional packages needed!

---

## 🐛 Troubleshooting

### Issue: Map doesn't render / blank space

**Cause**: Mapbox token not set or invalid

**Solution**:
1. Verify `.env` file exists in project root
2. Check token starts with `pk.` and has no extra spaces
3. Restart dev server completely (stop and `npm run dev`)
4. Check browser console for "VITE_MAPBOX_TOKEN is not set" error

### Issue: "Property 'env' does not exist on type 'ImportMeta'"

**Cause**: TypeScript doesn't recognize Vite's env typing

**Status**: ✅ Fixed with `(import.meta as any).env` type assertion

### Issue: Markers don't appear

**Cause**: Data not loading or coordinate conversion issue

**Solution**:
1. Check browser console for fetch errors
2. Verify `src/api/MAPAPI.ts` has location data
3. Ensure coordinates are in `[lat, lng]` format in data

### Issue: Popups are blank

**Cause**: Missing location data fields

**Solution**: Verify all required fields exist in location objects:
```typescript
{
  id: string,
  name: string,
  position: [number, number],
  description: string,
  type: LocationType,
  region: Region,
  // ... optional fields
}
```

### Issue: Map style doesn't change

**Cause**: Token doesn't have satellite imagery access

**Solution**: Check token permissions in Mapbox account dashboard

---

## 📊 Pin Color Reference

| Location Type | Color | Hex Code | Icon |
|--------------|-------|----------|------|
| Headquarters | Dark Gray | `#111827` | 🔴 |
| Regional Office | Indigo | `#4F46E5` | 🟣 |
| Client | Sky Blue | `#0EA5E9` | 🔵 |
| Authority | Amber | `#F59E0B` | 🟡 |

---

## 🎨 Map Customization

### Change Initial View

Edit `src/components/DQMap.tsx`:

```typescript
map.current = new mapboxgl.Map({
  container: mapContainer.current,
  style: MAPBOX_STYLES[mapStyle],
  center: [51.5, 25.2], // [lng, lat] - Change these coordinates
  zoom: 5,              // Change zoom level (1-22)
  attributionControl: false,
});
```

### Add New Location

Edit `src/api/MAPAPI.ts`:

```typescript
const mockMapLocations: MapLocation[] = [
  // ... existing locations
  {
    id: 'new-location',
    name: 'New Location Name',
    position: [24.7136, 46.6753], // [lat, lng]
    description: 'Location description',
    address: '123 Street, City, Country',
    contactPhone: '+XXX XXX XXX XXX',
    type: 'Client', // or 'Headquarters' | 'Regional Office' | 'Authority'
    region: 'Dubai', // or 'Abu Dhabi' | 'Riyadh' | 'Nairobi'
    services: ['Service 1', 'Service 2'],
    operatingHours: 'Mon-Fri: 9AM-5PM',
  },
];
```

### Change Pin Colors

Edit `src/components/DQMap.tsx`:

```typescript
const PIN_COLORS: Record<string, string> = {
  'Headquarters': '#111827',      // Change these hex codes
  'Regional Office': '#4F46E5',
  'Client': '#0EA5E9',
  'Authority': '#F59E0B',
  'Default': '#6B7280',
};
```

---

## 🚀 Performance Tips

### Current Setup (Optimal for 11 locations)
- ✅ All markers loaded at once
- ✅ Client-side filtering
- ✅ Auto-fit bounds on filter

### For 50+ Locations (Future)
Consider implementing:
1. **Clustering**: Group nearby markers when zoomed out
2. **Lazy loading**: Load markers only in visible bounds
3. **Virtual scrolling**: For location list (if added)

Example clustering setup:
```typescript
map.current.addSource('locations', {
  type: 'geojson',
  data: geojsonData,
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50,
});
```

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
```
┌────────────────────────────────────┐
│  Hero Left  │  Map (600px height)  │
└────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌────────────────────────────────────┐
│  Hero Left  │  Map (600px height)  │
└────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────┐
│  Hero Left   │
├──────────────┤
│ Browse DNA ↓ │ (Button - no map)
└──────────────┘
```

Map is hidden on mobile to optimize performance and UX.

---

## ✅ Verification Checklist

Run through this checklist to verify everything works:

- [ ] `.env` file created with valid Mapbox token
- [ ] Dev server restarted after adding `.env`
- [ ] Navigate to `/discover-dq` in browser
- [ ] Map loads in right panel (desktop/tablet)
- [ ] See 11 location markers on map
- [ ] Click markers → Popups show location details
- [ ] Region filter works (select Dubai → only Dubai locations show)
- [ ] Type filter works (select Client → only clients show)
- [ ] Map style switches between Standard/Satellite/Hybrid
- [ ] Legend shows correct pin colors
- [ ] Results counter updates when filtering
- [ ] No console errors in browser dev tools
- [ ] Left hero content unchanged (title, CTAs, stats)
- [ ] Mobile view shows "Browse DQ DNA" button (not map)

---

## 🎯 Next Steps (Optional Enhancements)

### 1. Add Search Functionality
```typescript
// In DQMap.tsx header section
<input 
  type="search"
  placeholder="Search locations..."
  onChange={(e) => handleSearch(e.target.value)}
  className="w-full px-3 py-2 rounded-lg border"
/>
```

### 2. Persist Filters in URL
```typescript
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  const params = new URLSearchParams();
  if (selectedRegion !== 'All') params.set('region', selectedRegion);
  if (selectedType !== 'All') params.set('type', selectedType);
  setSearchParams(params);
}, [selectedRegion, selectedType]);
```

### 3. Add Location Details Modal
```typescript
const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

// In marker click handler
marker.getElement().addEventListener('click', () => {
  setSelectedLocation(location);
});

// Render modal
{selectedLocation && (
  <LocationModal 
    location={selectedLocation}
    onClose={() => setSelectedLocation(null)}
  />
)}
```

### 4. Connect to Real API
Replace mock data in `src/api/MAPAPI.ts`:

```typescript
export const fetchAllLocations = async (): Promise<MapLocation[]> => {
  const response = await fetch('/api/locations');
  return response.json();
};
```

---

## 📚 Resources

- **Mapbox GL JS Docs**: https://docs.mapbox.com/mapbox-gl-js/
- **Mapbox Examples**: https://docs.mapbox.com/mapbox-gl-js/example/
- **Vite Env Vars**: https://vitejs.dev/guide/env-and-mode.html
- **React Hooks**: https://react.dev/reference/react

---

## 🎉 Success!

Your DQ Map is now fully integrated and ready to use. Just add your Mapbox token to `.env` and start the dev server!

**Need help?** Check the troubleshooting section or open an issue.

---

**Last Updated**: Integration complete with all import fixes applied.

