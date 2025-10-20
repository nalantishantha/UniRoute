# Category Filter Update - Program Matching

## Overview
Updated the category filters in the Program Matching page to use actual database stream values with user-friendly display names.

## Changes Made

### Category Mapping Updated

**Previous Mapping** (Indirect):
- Frontend used: engineering, medical, technology, business, arts
- Backend mapped these to database values

**New Mapping** (Direct):
- Frontend now uses actual database values directly
- Display names updated to match stream nomenclature

### New Category Structure

| Filter ID    | Display Name       | Matches DB Column `subject_stream_required` |
|--------------|-------------------|---------------------------------------------|
| all          | All Programs      | (no filter - shows all)                     |
| Maths        | Physical Science  | Maths                                       |
| Science      | Biological Science| Science                                     |
| Commerce     | Commerce          | Commerce                                    |
| Arts         | Arts              | Arts                                        |
| Technology   | Technology        | Technology                                  |
| Other        | Open              | Other                                       |

### Benefits

1. **Simplified Logic**: No mapping needed between frontend and backend
2. **Database Consistency**: Filter values match database exactly
3. **User-Friendly Names**: Display names are clear and educational
4. **Accurate Filtering**: Direct database queries without translation
5. **Easier Maintenance**: Changes to database values automatically reflected

## Files Modified

### Backend
**File**: `backend/apps/university_programs/views.py`
- Removed category mapping dictionary
- Filter now directly uses `subject_stream_required` value
- Category in response now uses `subject_stream_required` directly

**Changes**:
```python
# Before
category_mapping = {
    'engineering': 'Maths',
    'medical': 'Science',
    ...
}
db_category = category_mapping.get(category)

# After
if category != 'all':
    programs_query = programs_query.filter(subject_stream_required=category)
```

### Frontend
**File**: `frontend/src/pages/Student/ProgramMatching.jsx`
- Updated category filter IDs to match database values
- Updated display names to user-friendly stream names

**Changes**:
```javascript
// Before
{ id: "engineering", name: "Engineering", icon: Target },
{ id: "medical", name: "Medical", icon: Award },

// After
{ id: "Maths", name: "Physical Science", icon: Target },
{ id: "Science", name: "Biological Science", icon: Award },
```

### Documentation
**File**: `docs/program-matching-implementation.md`
- Updated category mapping table
- Updated API parameter documentation

## Testing

### Test Cases

1. **All Programs Filter**
   - URL: `http://localhost:3000/program-matching`
   - Click "All Programs"
   - Should show all active programs

2. **Physical Science (Maths)**
   - Click "Physical Science" filter
   - API: `GET /api/university-programs/programs/?category=Maths`
   - Should show only programs with `subject_stream_required = 'Maths'`

3. **Biological Science (Science)**
   - Click "Biological Science" filter
   - API: `GET /api/university-programs/programs/?category=Science`
   - Should show only programs with `subject_stream_required = 'Science'`

4. **Commerce**
   - Click "Commerce" filter
   - API: `GET /api/university-programs/programs/?category=Commerce`
   - Should show only programs with `subject_stream_required = 'Commerce'`

5. **Arts**
   - Click "Arts" filter
   - API: `GET /api/university-programs/programs/?category=Arts`
   - Should show only programs with `subject_stream_required = 'Arts'`

6. **Technology**
   - Click "Technology" filter
   - API: `GET /api/university-programs/programs/?category=Technology`
   - Should show only programs with `subject_stream_required = 'Technology'`

7. **Open (Other)**
   - Click "Open" filter
   - API: `GET /api/university-programs/programs/?category=Other`
   - Should show only programs with `subject_stream_required = 'Other'`

### Database Values

Ensure your `degree_programs` table has programs with the following `subject_stream_required` values:
- `'Maths'` - For physical science/engineering programs
- `'Science'` - For biological science/medical programs
- `'Commerce'` - For business/commerce programs
- `'Arts'` - For arts/humanities programs
- `'Technology'` - For technology programs
- `'Other'` - For programs open to all streams

### Example Programs by Stream

**Maths (Physical Science)**:
- Bachelor of Engineering
- BSc in Mathematics
- BSc in Physics
- BSc in Computer Science (if categorized as Maths)

**Science (Biological Science)**:
- MBBS (Medicine)
- BDS (Dental Surgery)
- BSc in Biological Sciences
- BSc in Chemistry

**Commerce**:
- BBA (Business Administration)
- BCom (Commerce)
- BSc in Accounting & Finance
- BSc in Economics

**Arts**:
- BA (Arts)
- BA in English
- BA in Sociology
- BA in Political Science

**Technology**:
- BSc in Information Technology
- BSc in Software Engineering
- BSc in Computer Engineering (if categorized as Technology)

**Other (Open)**:
- General degrees accepting any stream
- Interdisciplinary programs

## API Examples

### Get All Programs
```bash
GET http://localhost:8000/api/university-programs/programs/
```

### Filter by Physical Science (Maths)
```bash
GET http://localhost:8000/api/university-programs/programs/?category=Maths
```

### Filter by Biological Science (Science)
```bash
GET http://localhost:8000/api/university-programs/programs/?category=Science
```

### Filter by Commerce
```bash
GET http://localhost:8000/api/university-programs/programs/?category=Commerce
```

### Filter by Technology
```bash
GET http://localhost:8000/api/university-programs/programs/?category=Technology
```

### Filter by Open (Other)
```bash
GET http://localhost:8000/api/university-programs/programs/?category=Other
```

### Combined Filter and Search
```bash
GET http://localhost:8000/api/university-programs/programs/?category=Maths&search=engineering
```

## Visual Changes

### Category Filter Buttons

**Before**:
```
[All Programs] [Engineering] [Medical] [Technology] [Business] [Arts]
```

**After**:
```
[All Programs] [Physical Science] [Biological Science] [Commerce] [Arts] [Technology] [Open]
```

## Notes

1. **Database Consistency**: Make sure your database has programs with correct `subject_stream_required` values
2. **Case Sensitive**: The filter values are case-sensitive ('Maths' not 'maths')
3. **Null Values**: Programs with NULL `subject_stream_required` will be treated as 'Other'
4. **Future Additions**: If new streams are added to the database, simply add them to the categories array in the frontend
5. **Icons**: Each category has an appropriate icon for better UX

## Migration from Old System

If you have existing programs with old category values, no database migration is needed. The `subject_stream_required` column should already have these values (Maths, Science, Commerce, Arts, Technology, Other).

## Advantages Over Previous System

1. ✅ **No Translation Layer**: Direct database-to-UI mapping
2. ✅ **Educational Naming**: Users see familiar A/L stream names
3. ✅ **Simplified Code**: Less complexity in filtering logic
4. ✅ **Better Performance**: Direct SQL WHERE clause
5. ✅ **Easier Debugging**: Filter values match database exactly
6. ✅ **Consistency**: Same values used across entire system (Z-Score Analysis also uses same streams)
