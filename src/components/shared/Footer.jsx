const Footer = () => {
  return (
    <footer className="bg-base-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 md:px-0 py-8 grid md:grid-cols-4 gap-6 text-sm">
        <div className="space-y-2">
          <h4 className="font-bold text-lg">eTuitionBd</h4>
          <p className="text-gray-600">
            A complete tuition management platform to connect students, tutors
            and admins with transparent payments and smart workflows.
          </p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Quick Links</h5>
          <ul className="space-y-1">
            <li>
              <a href="/" className="link link-hover">
                Home
              </a>
            </li>
            <li>
              <a href="/tuitions" className="link link-hover">
                Tuitions
              </a>
            </li>
            <li>
              <a href="/tutors" className="link link-hover">
                Tutors
              </a>
            </li>
            <li>
              <a href="/contact" className="link link-hover">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Contact</h5>
          <p>Dhaka, Bangladesh</p>
          <p>Phone: +880 1234-567890</p>
          <p>Email: support@etuitionbd.com</p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Follow us</h5>
          <div className="flex gap-3 text-xl">
            <a href="#" aria-label="Facebook">
              📘
            </a>
            <a href="#" aria-label="X">
              𝕏
            </a>
            <a href="#" aria-label="LinkedIn">
              💼
            </a>
            <a href="#" aria-label="Instagram">
              📸
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-base-200 py-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} eTuitionBd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
