# HCM Lite — Saylani Hackathon Beginner Track

## Design direction
Dark-first “Nightshift” interface: midnight blue/charcoal surfaces, electric violet actions, restrained mint/amber/red statuses, consistent typography, staggered page entrance, button micro-interactions, toasts, responsive layout, and a persistent light/dark toggle. This is an original implementation informed by common HR dashboard patterns, not a copied design.

Design inspiration references:
- Dribbble — HR Management Dashboard, Dark Mode UI: https://dribbble.com/shots/27018971-HR-Management-Dashboard-Dark-Mode-UI-Design
- Dribbble — Dark Mode HR Dashboard: https://dribbble.com/shots/26611466-Dark-Mode-HR-Dashboard-Modern-Employee-Management-UI
- Dribbble employee leave dashboard search: https://dribbble.com/search/employee-leave-dashboard

## Run
1. Extract the ZIP.
2. Open `HCM_Lite_Project` in VS Code.
3. Use Live Server on the root `index.html` (do not open a page directly before first setup).
4. Create the company and Admin account.
5. Add an employee from the Admin Employees page. Note the credentials created for that employee.
6. Sign out and sign in via Employee Access.

## Leave request workflow
1. Employee opens their dashboard → **Request time off**.
2. Select leave category, reason category, first and last day, explain the request, and optionally add contact/coverage details.
3. The app calculates working days, checks date order/past dates, overlap, and the configured yearly quota.
4. On submit, a saved `Pending` request appears in the employee's Leave request history and the Admin's Leave management inbox.
5. Admin filters/searches requests, reviews employee/date/reason details, then approves or rejects. A rejection must include a reason. Decisions are saved with a timestamp and administrator ID.
6. Employee sees the final status, HR note, request dates and updated remaining quota. Only approved leave reduces the approved balance; pending requests reserve quota for validation.

## Payslip workflow
Open Payroll & Payslips, choose a month (and employee if Admin), press Generate payslip, review the salary, working days, absence/half-day deductions and net pay, then press **Print / Save as PDF**. In the browser print dialog choose **Save as PDF**. Generations are logged locally in `hcm_payslip_history` to avoid silently losing every generated period.

## Included features
- Admin and Employee role routing.
- Company setup, employee management and settings.
- Attendance check-in/check-out and records.
- Employee leave request form, working-day estimate, validation, HR inbox, approve/reject feedback and balance.
- Payslip calculation and browser printing.
- Smart helper chat with quick prompts; answers use app data and employees only get their own records.
- Persistent dark/light theme and responsive UI.
- Toast confirmations and input feedback.

## Data and security limitations
The brief specifies `localStorage` and no backend. This is a learning/hackathon demo: the app only shares records inside the same browser profile on the same origin. It does not synchronize separate devices or browsers. Demo passwords are stored in plain text in localStorage and must never be used for real employee data. A production system needs a backend, database, secure authentication/password hashing, server-side authorization and a proper audit log.

## Business rules
- Leave date range must be valid; weekends/non-working days are excluded according to Admin settings; overlapping Pending/Approved requests are blocked; yearly quota is checked before submission and approval.
- Attendance is evaluated using office start time plus grace minutes; one check-in per employee per day; checkout follows check-in; short shifts may become half-day.
- Payslip calculation follows the hackathon brief: daily salary = monthly salary / working days; deduction = daily salary × (absent days + 0.5 × half-days); net = salary − deduction. Verify records before treating this learning calculation as payroll.
