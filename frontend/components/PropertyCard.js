import Link from "next/link";

export default function PropertyCard({ property }) {
  const img = property.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
  return (
    <Link
      href={`/properties/${property._id}`}
      className="group block bg-white/40 border border-charcoal/10 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500"
    >
      <div className="overflow-hidden h-64">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-brass mb-2">{property.location?.city}</p>
        <h3 className="font-display text-xl mb-2">{property.title}</h3>
        <p className="text-sm text-charcoal/60 mb-4">
          {property.bedrooms} bed · {property.bathrooms} bath · {property.areaSqft} sqft
        </p>
        <p className="font-display text-lg text-charcoal">
          Rs {Number(property.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
