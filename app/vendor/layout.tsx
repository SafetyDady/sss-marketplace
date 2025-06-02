// /app/vendor/layout.tsx
export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="pt-[68px] px-4">
      {children}
    </section>
  )
}
