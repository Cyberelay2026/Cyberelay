"use client";

import { useMemo, useState } from "react";
import { ComputerCard } from "@/components/computer-card";
import type { PublicComputer } from "@/lib/computer";

export function ComputerBrowser({ computers, loadError = false }: { computers: PublicComputer[]; loadError?: boolean }) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [ram, setRam] = useState("All");
  const [storage, setStorage] = useState("All");
  const [cpu, setCpu] = useState("All");
  const [condition, setCondition] = useState("All");
  const [maxPrice, setMaxPrice] = useState("All");

  const brands = ["All", ...Array.from(new Set(computers.map((c) => c.brand)))];
  const cpus = ["All", ...Array.from(new Set(computers.map((c) => c.cpu)))];
  const conditions = ["All", ...Array.from(new Set(computers.map((c) => c.condition)))];
  const ramOptions = Array.from(new Set(computers.map((c) => c.ram))).sort((a, b) => a - b);
  const storageOptions = Array.from(new Set(computers.map((c) => c.storage))).sort((a, b) => a - b);
  const hasActiveFilters = search !== "" || brand !== "All" || ram !== "All" || storage !== "All" || cpu !== "All" || condition !== "All" || maxPrice !== "All";

  const filtered = useMemo(() => computers.filter((c) => {
    const q = search.trim().toLowerCase();
    return (!q || `${c.brand} ${c.model} ${c.cpu}`.toLowerCase().includes(q))
      && (brand === "All" || c.brand === brand)
      && (ram === "All" || c.ram === Number(ram))
      && (storage === "All" || c.storage === Number(storage))
      && (cpu === "All" || c.cpu === cpu)
      && (condition === "All" || c.condition === condition)
      && (maxPrice === "All" || c.price <= Number(maxPrice));
  }), [computers, search, brand, ram, storage, cpu, condition, maxPrice]);

  function clearFilters() {
    setSearch(""); setBrand("All"); setRam("All"); setStorage("All");
    setCpu("All"); setCondition("All"); setMaxPrice("All");
  }

  function Filters() {
    return <>
      <label className="search-field"><span>Search</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Brand, model or CPU" /></label>
      <label><span>Brand</span><select value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>RAM</span><select value={ram} onChange={(e) => setRam(e.target.value)}><option>All</option>{ramOptions.map((value) => <option value={value} key={value}>{value}GB</option>)}</select></label>
      <label><span>Storage</span><select value={storage} onChange={(e) => setStorage(e.target.value)}><option>All</option>{storageOptions.map((value) => <option value={value} key={value}>{value >= 1024 ? `${value / 1024}TB` : `${value}GB`}</option>)}</select></label>
      <label><span>CPU</span><select value={cpu} onChange={(e) => setCpu(e.target.value)}>{cpus.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Condition</span><select value={condition} onChange={(e) => setCondition(e.target.value)}>{conditions.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Max price</span><select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}><option value="All">Any price</option><option value="300">$300 or less</option><option value="400">$400 or less</option><option value="500">$500 or less</option><option value="750">$750 or less</option><option value="1000">$1,000 or less</option></select></label>
      <div className="filter-actions"><button type="button" className="clear-filters" onClick={clearFilters} disabled={!hasActiveFilters}>Clear filters</button></div>
    </>;
  }

  return <main className="section"><div className="container">
    <div className="page-heading"><div className="eyebrow">USED LAPTOPS &amp; COMPUTERS IN CALGARY</div><h1>Find your next computer</h1><p>Compare {filtered.length} available computer{filtered.length === 1 ? "" : "s"} by specs, condition and price.</p></div>
    <details className="mobile-filter-panel"><summary>Filter computers{hasActiveFilters ? " · Active" : ""}</summary><div className="filters mobile-filter-content"><Filters /></div></details>
    <div className="filters desktop-filters"><Filters /></div>
    {loadError ? <div className="empty-state"><h2>Inventory temporarily unavailable</h2><p>Please refresh the page and try again.</p></div>
      : filtered.length ? <div className="card-grid">{filtered.map((computer) => <ComputerCard computer={computer} key={computer.id} />)}</div>
      : <div className="empty-state"><h2>No matching computers</h2><p>Try removing a filter or increasing your maximum price.</p>{hasActiveFilters && <button type="button" className="button button-outline" onClick={clearFilters}>Clear filters</button>}</div>}
  </div></main>;
}
