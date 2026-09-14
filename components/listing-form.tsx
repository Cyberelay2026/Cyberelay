"use client";

import { useActionState } from "react";
import {
  brands, conditions, cpuFamilies, gpuBrands, gpuTypes, osFamilies, provinces,
  ramOptions, resolutions, screenSizes, storageOptions, storageTypes,
} from "@/lib/listing-options";
import { createListing, type ListingActionState } from "@/app/seller/listings/new/actions";
import styles from "@/app/seller/listings/new/new-listing.module.css";

const initialState: ListingActionState = {};
const storageLabel = (value: number) => value >= 1024 ? `${value / 1024}TB` : `${value}GB`;

export function ListingForm() {
  const [state, action, pending] = useActionState(createListing, initialState);
  const error = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={action} className={styles.form}>
      {state.error && (
        <div className={styles.formError} role="alert">
          <strong>{state.error}</strong>
          {state.fieldErrors && <ul>{Object.entries(state.fieldErrors).map(([fieldName, message]) => <li key={fieldName}>{message}</li>)}</ul>}
        </div>
      )}

      <fieldset><legend>Computer basics</legend><div className={styles.grid}>
        <Field label="Listing title" name="title" error={error("title")} wide><input name="title" required minLength={5} maxLength={120} placeholder="e.g. Lenovo ThinkPad T14 Gen 2" /></Field>
        <Select label="Brand" name="brand" error={error("brand")} options={brands.map((v) => [v, v])} />
        <Field label="Model" name="model" error={error("model")}><input name="model" required maxLength={100} placeholder="ThinkPad T14 Gen 2" /></Field>
        <Select label="Condition" name="condition" error={error("condition")} options={conditions} />
        <Field label="Price (CAD)" name="price" error={error("price")}><input name="price" required inputMode="decimal" placeholder="499.00" /></Field>
      </div></fieldset>

      <fieldset><legend>Processor and memory</legend><div className={styles.grid}>
        <Select label="CPU brand" name="cpu_brand" error={error("cpu_brand")} options={Object.keys(cpuFamilies).map((v) => [v, v])} />
        <Select label="CPU family" name="cpu_family" error={error("cpu_family")} options={Object.entries(cpuFamilies).flatMap(([brand, families]) => families.map((family) => [family, `${brand} — ${family}`]))} />
        <Field label="CPU model" name="cpu_model" error={error("cpu_model")}><input name="cpu_model" required maxLength={100} placeholder="e.g. i5-1135G7" /></Field>
        <Select label="RAM" name="ram_gb" error={error("ram_gb")} options={ramOptions.map((v) => [String(v), `${v}GB`])} />
      </div></fieldset>

      <fieldset><legend>Storage and graphics</legend><div className={styles.grid}>
        <Select label="Storage capacity" name="storage_gb" error={error("storage_gb")} options={storageOptions.map((v) => [String(v), storageLabel(v)])} />
        <Select label="Storage type" name="storage_type" error={error("storage_type")} options={storageTypes} />
        <Select label="GPU type" name="gpu_type" error={error("gpu_type")} options={gpuTypes} />
        <Select label="GPU brand (optional)" name="gpu_brand" error={error("gpu_brand")} optional options={gpuBrands.map((v) => [v, v])} />
        <Field label="GPU model (optional)" name="gpu_model" error={error("gpu_model")}><input name="gpu_model" maxLength={100} placeholder="e.g. GeForce RTX 3060" /></Field>
      </div></fieldset>

      <fieldset><legend>Display and operating system</legend><div className={styles.grid}>
        <Select label="Screen size (optional)" name="screen_size_inches" error={error("screen_size_inches")} optional options={screenSizes.map((v) => [String(v), `${v} inches`])} />
        <Select label="Resolution (optional)" name="resolution" error={error("resolution")} optional options={resolutions} />
        <Select label="Operating system (optional)" name="os_family" error={error("os_family")} optional options={osFamilies.map((v) => [v, v])} />
        <Field label="OS version (optional)" name="os_version" error={error("os_version")}><input name="os_version" maxLength={60} placeholder="e.g. 11" /></Field>
        <Field label="OS edition (optional)" name="os_edition" error={error("os_edition")}><input name="os_edition" maxLength={60} placeholder="e.g. Pro" /></Field>
        <Field label="Battery health % (optional)" name="battery_health_percent" error={error("battery_health_percent")}><input name="battery_health_percent" type="number" min="0" max="100" step="1" /></Field>
      </div></fieldset>

      <fieldset><legend>Location and Marketplace</legend><div className={styles.grid}>
        <Field label="City" name="city" error={error("city")}><input name="city" required maxLength={80} placeholder="Calgary" /></Field>
        <Select label="Province or territory" name="province" error={error("province")} options={provinces} />
        <Field label="Facebook Marketplace URL" name="facebook_marketplace_url" error={error("facebook_marketplace_url")} wide><input name="facebook_marketplace_url" type="url" required placeholder="https://www.facebook.com/marketplace/item/..." /></Field>
      </div></fieldset>

      <fieldset><legend>Seller notes</legend><div className={styles.grid}>
        <Field label="Description (optional)" name="description" error={error("description")} wide><textarea name="description" maxLength={5000} rows={6} placeholder="Describe the computer, included accessories and anything a buyer should know." /></Field>
        <Field label="Cosmetic notes (optional)" name="cosmetic_notes" error={error("cosmetic_notes")} wide><textarea name="cosmetic_notes" maxLength={2000} rows={4} placeholder="Note scratches, dents, wear or other cosmetic details." /></Field>
      </div></fieldset>

      <div className={styles.actions}><button className="button" disabled={pending} type="submit">{pending ? "Saving draft…" : "Save draft"}</button><p>This creates a private draft. Publishing will be added in the next milestone.</p></div>
    </form>
  );
}

function Field({ label, name, error, wide, children }: { label:string;name:string;error?:string;wide?:boolean;children:React.ReactNode }) {
  return <label className={wide ? styles.wide : undefined}><span>{label}</span>{children}{error && <small className={styles.fieldError}>{error}</small>}</label>;
}

function Select({ label, name, error, options, optional=false }: { label:string;name:string;error?:string;options:ReadonlyArray<readonly [string,string]>;optional?:boolean }) {
  return <label><span>{label}</span><select name={name} required={!optional} defaultValue=""><option value="">{optional ? "Not specified" : "Select one"}</option>{options.map(([value,text]) => <option value={value} key={`${name}-${value}`}>{text}</option>)}</select>{error && <small className={styles.fieldError}>{error}</small>}</label>;
}
