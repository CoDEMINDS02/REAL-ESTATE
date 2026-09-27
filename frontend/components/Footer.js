export default function Footer() {
  return (
    <footer className="bg-charcoal text-stone py-14 px-8 md:px-16 mt-24">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-display text-2xl mb-2">Meridian Estates</p>
          <p className="text-sm text-stone/60 max-w-xs">
            Curated residences for the discerning few. Karachi, Pakistan.
          </p>
        </div>
        <div className="text-sm text-stone/70 space-y-2">
          <p>hello@meridianestates.com</p>
          <p>+92 300 1234567</p>
        </div>
      </div>
      <p className="text-xs text-stone/40 mt-10">© {new Date().getFullYear()} Meridian Estates. All rights reserved.</p>
    </footer>
  );
}
