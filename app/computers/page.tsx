"use client";

import { useMemo, useState } from "react";
import { ComputerCard } from "@/components/computer-card";
import { computers } from "@/data/computers";

export default function ComputersPage() {
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
  const hasActiveFilters = search !== "" || brand !== "All" || ram !== "All" || storage !== "All" || cpu !== "All" || condition !== "All" || maxPrice !== "All";

  const filtered = useMemo(
    () =>
      computers.filter((c) => {
        const q = search.trim().toLowerCase();
        const matchesSearch = !q || `${c.brand} ${c.model} ${c.cpu}`.toLowerCase().includes(q);
        const matchesBrand = brand === "All" || c.brand === brand;
        const matchesRam = ram === "All" || c.ram === Number(ram);
        const matchesStorage = storage === "All" || c.storage === Number(storage);
        const matchesCpu = cpu === "All" || c.cpu === cpu;
        const matchesCondition = condition === "All" || c.condition === condition;
        const matchesPrice = maxPrice === "All" || c.price <= Number(maxPrice);

        // Every selected filter must match the same computer.
        return matchesSearch && matchesBrand && matchesRam && matchesStorage && matchesCpu && matchesCondition && matchesPrice;
      }),
    [search, brand, ram, storage, cpu, condition, maxPrice]
  );

  function clearFilters() {
    setSearch("");
    setBrand("All");
    setRam("All");
    setStorage("All");
    setCpu("All");
    setCondition("All");
    setMaxPrice("All");
  }

  return (
    <main className="section">
      <div className="container">
        <div className="page-heading">
          <div className="eyebrow">CYBERELAY INVENTORY</div>
          <h1>Used computers</h1>
          <p>
            {filtered.length} computer{filtered.length === 1 ? "" : "s"} available
          </p>
        </div>

        <div className="filters">
          <label className="search-field">
            <span>Search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Brand, model or CPU"
            />
          </label>

          <label>
            <span>Brand</span>
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>

          <label>
            <span>RAM</span>
            <select value={ram} onChange={(e) => setRam(e.target.value)}>
              <option>All</option>
              <option value="8">8GB</option>
              <option value="16">16GB</option>
            </select>
          </label>

          <label>
            <span>Storage</span>
            <select value={storage} onChange={(e) => setStorage(e.target.value)}>
              <option>All</option>
              <option value="256">256GB</option>
              <option value="512">512GB</option>
            </select>
          </label>

          <label>
            <span>CPU</span>
            <select value={cpu} onChange={(e) => setCpu(e.target.value)}>
              {cpus.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Condition</span>
            <select value={condition} onChange={(e) => setCondition(e.target.value)}>
              {conditions.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Max price</span>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="All">Any price</option>
              <option value="300">$300 or less</option>
              <option value="400">$400 or less</option>
              <option value="500">$500 or less</option>
              <option value="750">$750 or less</option>
              <option value="1000">$1,000 or less</option>
            </select>
          </label>

          <div className="filter-actions">
            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear filters
            </button>
          </div>
        </div>

        {filtered.length ? (
          <div className="card-grid">
            {filtered.map((c) => (
              <ComputerCard computer={c} key={c.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No matches</h2>
            <p>No computer matches all of the selected filters.</p>
            {hasActiveFilters && (
              <button type="button" className="button button-outline" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
