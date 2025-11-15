import Image from "next/image";

interface ExcursionHeaderProps {
  title: string;
  countries: { name: string; abbr: string }[];
}

export function ExcursionHeader({ title, countries }: ExcursionHeaderProps) {
  return (
    <div className="flex justify-start items-center text-center mb-4">
      {countries.length > 0 && (
        <div className="flex items-center flex-shrink-0 mr-4">
          {countries.map((country) => (
            <Image
              key={country.abbr}
              src={`https://flagcdn.com/${country.abbr}.svg`}
              alt={`${country.name} flag`}
              width={48}
              height={32}
              className="border border-gray-300 rounded-[4px]"
              title={country.name}
            />
          ))}
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-secondary">
        {title}
      </h1>
    </div>
  );
}
