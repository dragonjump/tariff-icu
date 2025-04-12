"use client";

import { useState, useEffect } from "react";
import FloatingButton from "@/components/FloatingButton";
import FeedbackModal from "@/components/FeedbackModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import logo from '../../public/logotariff.png';

export default function Home() {
  const [country, setCountry] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [tariffRates, setTariffRates] = useState<{ title: string; rates: { [country: string]: number } }>({
    title: "",
    rates: {},
  });
  const [finalPrice, setFinalPrice] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTariffRates = async () => {
      try {
        const response = await fetch('https://n8n.jom.lol/webhook/tariff-rate');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Data:", data);
        if (Array.isArray(data) && data.length > 0 && data[0].rates) {
          const { Title, rates } = data[0];
          setTariffRates({ title: Title, rates: rates });
          if (Object.keys(rates).length > 0) {
            setCountry(Object.keys(rates)[0]); // Set initial country
          }
        } else {
          console.error('Invalid tariff rates data:', data);
        }
      } catch (error) {
        console.error('Failed to fetch tariff rates:', error);
      }
    };

    fetchTariffRates();
  }, []);

  const countryList = Object.keys(tariffRates.rates).sort();

  // Backup functions for hardcoded logic
  const calculateTariffWithHardcodedRates = (price: number, country: string) => {
    const hardcodedRates: { [country: string]: number } = {
      "China": 0.34, "European Union": 0.20, "Vietnam": 0.46, "Taiwan": 0.32, "Japan": 0.24,
      "South Korea": 0.25, "India": 0.26, "Thailand": 0.36, "Switzerland": 0.31, "Malaysia": 0.24,
      "Indonesia": 0.32, "Cambodia": 0.49, "South Africa": 0.30, "Israel": 0.17, "Bangladesh": 0.37,
      "Iraq": 0.39, "Philippines": 0.17, "Guyana": 0.38, "Pakistan": 0.29, "Sri Lanka": 0.44,
      "Norway": 0.15, "Venezuela": 0.15, "Nicaragua": 0.18, "Nigeria": 0.14, "Algeria": 0.30,
      "Jordan": 0.20, "Kazakhstan": 0.27, "Angola": 0.32, "Libya": 0.31, "Laos": 0.48,
      "Madagascar": 0.47, "Tunisia": 0.28, "Serbia": 0.37, "Myanmar (Burma)": 0.44, "Côte d'Ivoire": 0.21,
      "Botswana": 0.37, "Lesotho": 0.50, "Mauritius": 0.40, "Liechtenstein": 0.37, "Fiji": 0.32,
      "Bosnia and Herzegovina": 0.35, "Namibia": 0.21, "North Macedonia": 0.33, "Brunei": 0.24,
      "Moldova": 0.31, "Democratic Republic of the Congo": 0.11, "Mozambique": 0.16, "Cameroon": 0.11,
      "Zambia": 0.17, "Equatorial Guinea": 0.13, "Zimbabwe": 0.18, "Chad": 0.13, "Falkland Islands (Islas Malvinas)": 0.41,
      "Malawi": 0.17, "Syria": 0.41, "Vanuatu": 0.22, "Nauru": 0.30
    };
    const tariffRate = hardcodedRates[country] || 0;
    return price * (1 + tariffRate);
  };

  const getCountryListFromHardcodedRates = () => {
    const hardcodedRates: { [country: string]: number } = {
      "China": 0.34, "European Union": 0.20, "Vietnam": 0.46, "Taiwan": 0.32, "Japan": 0.24,
      "South Korea": 0.25, "India": 0.26, "Thailand": 0.36, "Switzerland": 0.31, "Malaysia": 0.24,
      "Indonesia": 0.32, "Cambodia": 0.49, "South Africa": 0.30, "Israel": 0.17, "Bangladesh": 0.37,
      "Iraq": 0.39, "Philippines": 0.17, "Guyana": 0.38, "Pakistan": 0.29, "Sri Lanka": 0.44,
      "Norway": 0.15, "Venezuela": 0.15, "Nicaragua": 0.18, "Nigeria": 0.14, "Algeria": 0.30,
      "Jordan": 0.20, "Kazakhstan": 0.27, "Angola": 0.32, "Libya": 0.31, "Laos": 0.48,
      "Madagascar": 0.47, "Tunisia": 0.28, "Serbia": 0.37, "Myanmar (Burma)": 0.44, "Côte d'Ivoire": 0.21,
      "Botswana": 0.37, "Lesotho": 0.50, "Mauritius": 0.40, "Liechtenstein": 0.37, "Fiji": 0.32,
      "Bosnia and Herzegovina": 0.35, "Namibia": 0.21, "North Macedonia": 0.33, "Brunei": 0.24,
      "Moldova": 0.31, "Democratic Republic of the Congo": 0.11, "Mozambique": 0.16, "Cameroon": 0.11,
      "Zambia": 0.17, "Equatorial Guinea": 0.13, "Zimbabwe": 0.18, "Chad": 0.13, "Falkland Islands (Islas Malvinas)": 0.41,
      "Malawi": 0.17, "Syria": 0.41, "Vanuatu": 0.22, "Nauru": 0.30
    };
    return Object.keys(hardcodedRates).sort();
  };

  const calculateTariff = () => {
    if (price === undefined) {
      setFinalPrice(undefined);
      return;
    }

    if (!tariffRates.rates || Object.keys(tariffRates.rates).length === 0) {
      console.warn("Tariff rates not loaded, please check.");
      setFinalPrice(undefined);
      return;
    }
    const tariffRate = tariffRates.rates[country] || 0;
    const calculatedPrice = price * (1 + tariffRate);
    setFinalPrice(calculatedPrice);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-md p-4">
          <div className="flex justify-center">
            {/* <Image src={logo} alt="Logo Tariff" className="h-20 w-auto mb-4" /> */}
            <img
              alt="Logo Tariff"
              src="https://tariff.icu/_next/static/media/logotariff.a63e59af.png"
              width="1024"
              height="1024"
              
              className="h-230 w-auto mb-4"
            />

          </div>
          <CardHeader>
            <CardTitle>Tariff Calculator</CardTitle>
            <CardDescription>Calculate the final price after applying tariff as of 3 Apr 2025.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="country">Select Country:</label>
              <Select onValueChange={setCountry} defaultValue={countryList[0]}>
                <SelectTrigger className="w-full text-black border-input shadow-sm focus:border-none">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="text-black shadow-md z-50">
                  {countryList.map((countryName) => (
                    <SelectItem key={countryName} value={countryName}>
                      {countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="price">Original Price:</label>
              <Input
                type="number"
                id="price"
                placeholder="Enter original price"
                onChange={(e) => {
                  const parsedPrice = parseFloat(e.target.value);
                  setPrice(isNaN(parsedPrice) ? undefined : parsedPrice);
                }}
              />
            </div>
            <button className="bg-[#76b0d8] text-white p-2 rounded hover:opacity-75" onClick={calculateTariff}>
              Calculate
            </button>
            {finalPrice !== undefined && (
              <div className="grid gap-2">
                <label>New Min Price after Tariff</label>
                <div className="font-semibold text-xl">{finalPrice.toFixed(2)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <FloatingButton onClick={() => setIsModalOpen(true)} />

        {isModalOpen && (
          <FeedbackModal open={isModalOpen} setOpen={setIsModalOpen} />
        )}
      </div>
    </div>
  );
}
