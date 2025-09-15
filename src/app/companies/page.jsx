// src/app/companies/page.jsx
import Companies from "../components/Companies.jsx";

export const metadata = {
  title: "Company Management | Admin Portal",
  description: "Manage and verify companies in the admin portal",
};

export default function CompanyManagementPage() {
  return <Companies />;
}
