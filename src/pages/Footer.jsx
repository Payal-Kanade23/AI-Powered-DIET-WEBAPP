export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Healthy Diet. All rights reserved.</p>
      </div>
    </footer>
  );
}