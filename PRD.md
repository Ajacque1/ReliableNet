# Product Requirements Document (PRD) for ReliableNet

## 1. Overview (Updated)
ReliableNet now focuses on **hyperlocal, community-driven internet quality**. Along with broad ISP comparisons and speed test results, the platform will feature **apartment complex** and **neighborhood-level** data. Residents and prospective tenants can see aggregated feedback on network stability, packet loss, and overall reliability within a specific building or community.

This pivot enhances ReliableNet's original mission by providing more granular and trustable data for individuals who rely on stable internet for remote work, streaming, or gaming—particularly in apartment settings.

## 2. Features & Prioritization

### Phase 1: Core Functionality (High Priority)
1. **Authentication System**
   - User Registration  
   - Login/Logout functionality  
   - Password reset flow  
   - Profile management  

2. **ISP Comparison Tool**
   - Search ISPs by location  
   - Filter ISPs by price, speed, and other factors  
   - Side-by-side ISP comparison  
   - Integration of user reviews (both ISP-level and apartment-level feedback)  

3. **Speed Test History**
   - Save speed test results  
   - Display historical data visualization  
   - Location-based speed test results  
   - Export functionality (CSV/JSON)  

4. **Apartment Complex & Neighborhood Database (New)**
   - CRUD (Create/Read/Update/Delete) for apartment complexes  
   - Store location, building details, and management contact (optional)  
   - Link complexes to user reviews and ISP metrics  
   - Simple listing/search to help users find their building or neighborhood  

### Phase 2: Enhanced Features (Medium Priority)
1. **Coverage Map**
   - Interactive ISP coverage map (updated to show specific buildings/neighborhoods)  
   - ISP availability checker at a building level  
   - Service area visualization  
   - Address lookup for precise results  

2. **Review System (Expanded)**
   - **Apartment Complex Reviews**  
     - New review form for residents to rate reliability, speeds, packet loss, etc.  
     - Summaries and badges (e.g., "WFH Friendly," "Streamer Approved")  
   - **Neighborhood Reviews**  
     - Aggregated feedback on local ISPs and general connectivity in the area  
   - Verified customer badges  
   - Review moderation tools to prevent spam/abuse  

3. **Backend Integration**
   - API routes for apartment complexes, reviews, and neighborhood data  
   - Database connections for storing and retrieving building-level information  
   - Data validation for security and consistency  
   - Error handling and logging  

### Phase 3: User Experience & Optimization (Low Priority)
1. **User Dashboard**
   - View speed test history and trends  
   - Saved ISP comparisons and apartment complex favorites  
   - User settings management  
   - Notification system for updates and alerts  

2. **Community Engagement & Extras**
   - In-app messaging or forum for residents of the same complex  
   - "Tips" or "FAQ" section to improve in-building networking setups  
   - Advanced analytics for building managers (e.g., daily reliability metrics)

## 3. Deployment Plan (Updated)
1. **Landing Page**: Complete, with added emphasis on apartment/neighborhood search.  
2. **Backend Setup**:  
   - **API & Database** connections for speed tests, ISP metrics, and apartment complexes.  
   - Prisma migrations ensuring building-level data is stored properly.  
3. **Frontend Development**:  
   - Implement new apartment listing and review pages (Phase 1).  
   - Integrate building-level coverage into the ISP Comparison Tool (Phase 2).  
4. **Testing & Optimization**:  
   - Conduct user testing of apartment-level features.  
   - Performance and security checks for new endpoints.  
   - Expand review moderation to handle building-specific feedback.  
5. **Full Launch**:  
   - Deploy the updated version with apartment-based reviews.  
   - Gather feedback from early adopters and refine.  

This PRD reflects a **hyperlocal pivot**, adding apartment-complex–specific features, community reviews, and expanded coverage data—while preserving all existing ISP comparisons and speed test functionality. 