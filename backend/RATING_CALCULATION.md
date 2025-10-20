# Rating Calculation Documentation

## Video Rating Calculation

**Formula**: `video_average_rating = (sum of all ratings for this video) / (number of ratings for this video)`

**Example**:
- Video 1 has ratings: 5, 4, 5, 4.5
- Video 1 average = (5 + 4 + 5 + 4.5) / 4 = 18.5 / 4 = **4.625** (displayed as 4.6)

## Course Rating Calculation

**Formula**: `course_average_rating = (sum of ALL video ratings in course) / (total number of video ratings in course)`

**Example**:
- Course has 2 videos
- Video 1 ratings: 5, 4, 5, 4.5 (average 4.625)
- Video 2 ratings: 4, 5, 4.5 (average 4.5)
- Course rating = (5 + 4 + 5 + 4.5 + 4 + 5 + 4.5) / 7 = 32 / 7 = **4.571** (displayed as 4.6)

**Note**: We calculate the course rating as the average of ALL individual video ratings, NOT the average of video averages. This ensures fair weighting.

### Why not average of averages?

If we used average of video averages:
- Course rating would be (4.625 + 4.5) / 2 = **4.563**

This would give equal weight to each video regardless of how many ratings it has, which is unfair. Our method gives equal weight to each individual rating, which is more accurate.

## Implementation

### Backend (Django)
- Video ratings are stored in `VideoRating` model
- Video average is calculated using `VideoRating.objects.filter(video=video).aggregate(avg=models.Avg('rating'))`
- Course average is calculated using `VideoRating.objects.filter(video__course=course).aggregate(avg=models.Avg('rating'))`

### Frontend (React)
- Ratings are displayed using a 5-star component
- Users can rate videos after watching them
- Stars are interactive and show half-star precision
- Course rating is displayed on course cards
- Individual video ratings are shown in the video list
