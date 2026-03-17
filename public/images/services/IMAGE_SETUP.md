# Service Card Images Setup Guide

## Quick Setup

All service cards are now configured to use local images from `/images/services/`. 

## Required Images

Place the following images in this directory (`public/images/services/`):

1. **it-support-form.jpg** - IT Support Form
   - Suggested theme: IT support, help desk, technology assistance
   - Example: https://www.pexels.com/photo/women-working-in-the-office-7658351/

2. **support-charter-template.jpg** - Support Charter Template
   - Suggested theme: Documentation, templates, agreements
   - Example: https://www.pexels.com/search/document/

3. **it-support-walkthrough.jpg** - IT Support Walkthrough
   - Suggested theme: Video tutorial, screen sharing, instructional
   - Example: https://www.pexels.com/search/tutorial/

4. **bookings.jpg** - Bookings
   - Suggested theme: Calendar, scheduling, appointments
   - Example: https://www.pexels.com/search/calendar/

5. **staff-requisition.jpg** - Staff Requisition
   - Suggested theme: Hiring, recruitment, team building
   - Example: https://www.pexels.com/search/recruitment/

6. **registration.jpg** - Registration
   - Suggested theme: Onboarding, registration forms, paperwork
   - Example: https://www.pexels.com/search/registration/

7. **dtmp-base-setup.jpg** - DTMP Base Setup
   - Suggested theme: Digital transformation, setup, configuration
   - Example: https://www.pexels.com/search/digital/

8. **governance.jpg** - Governance
   - Suggested theme: Compliance, governance, reporting
   - Example: https://www.pexels.com/search/governance/

9. **proposal.jpg** - Proposal
   - Suggested theme: Proposals, presentations, business documents
   - Example: https://www.pexels.com/search/proposal/

## Image Specifications

- **Format**: JPEG or PNG
- **Dimensions**: 800x400px (2:1 aspect ratio)
- **File Size**: Keep under 500KB for optimal performance
- **Quality**: High quality, professional images

## Downloading Images

### Option 1: Using Pexels
1. Visit https://www.pexels.com/
2. Search for relevant keywords (see suggestions above)
3. Download images in 800x400px or larger
4. Resize to 800x400px if needed
5. Save with the exact filename listed above

### Option 2: Using Unsplash
1. Visit https://unsplash.com/
2. Search for relevant keywords
3. Download images
4. Resize to 800x400px
5. Save with the exact filename listed above

### Option 3: Using Your Own Images
1. Use your own stock photos or company images
2. Ensure they match the service theme
3. Resize to 800x400px
4. Save with the exact filename listed above

## Image Optimization

Before adding images, consider optimizing them:
- Use tools like TinyPNG or ImageOptim
- Compress images while maintaining quality
- Ensure images are web-optimized

## Testing

After adding images:
1. Restart your development server
2. Navigate to the Services Center page
3. Verify all service cards display their images correctly
4. Check that images load quickly

## Fallback Behavior

If an image fails to load, the card will display a grey gradient placeholder. This ensures the UI remains functional even if images are missing.


