import Link from "next/link";
import { requireApprovedAccount } from "@/lib/account-access";
import { setAccountStatus } from "./actions";
import styles from "./admin.module.css";

type AdminUser = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: "seller" | "admin";
  account_status: "pending" | "approved" | "suspended";
  created_at: string;
  last_sign_in_at: string | null;
};

function date(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ updated?: string; error?: string }> }) {
  const query = await searchParams;
  const { supabase, userId } = await requireApprovedAccount(true);
  const { data, error } = await supabase.rpc("admin_list_users");
  const users = (data ?? []) as AdminUser[];

  return <main className={`section ${styles.page}`}><div className="container">
    <header className={styles.header}>
      <div><span className="eyebrow">ADMIN DASHBOARD</span><h1>Users and listings</h1><p>Review seller access and manage your own Cyberelay inventory.</p></div>
      <div className={styles.actions}>
        <Link className="button" href="/seller/listings/new">Add Computer</Link>
        <Link className="button button-outline" href="/seller">My Listings</Link>
      </div>
    </header>

    {query.updated && <div className={styles.notice} role="status">Account status updated to {query.updated}.</div>}
    {(query.error || error) && <div className={`${styles.notice} ${styles.error}`} role="alert">We couldn&apos;t update or load the user list.</div>}

    <section className={styles.section} aria-labelledby="users-heading">
      <h2 id="users-heading">User review</h2>
      <p>Approve new sellers or suspend access. Authentication records are retained.</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Last sign-in</th><th>Action</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.user_id}>
            <td><strong>{user.display_name || "Unnamed user"}</strong><br />{user.email || "No email"}</td>
            <td>{user.role}</td>
            <td><span className={styles.status}>{user.account_status}</span></td>
            <td>{date(user.created_at)}</td><td>{date(user.last_sign_in_at)}</td>
            <td><div className={styles.userActions}>
              {user.user_id === userId ? <span>Current admin</span> : <>
                {user.account_status !== "approved" && <form action={setAccountStatus}><input type="hidden" name="user_id" value={user.user_id} /><input type="hidden" name="status" value="approved" /><button className="button button-small" type="submit">Approve</button></form>}
                {user.account_status !== "suspended" && <form action={setAccountStatus}><input type="hidden" name="user_id" value={user.user_id} /><input type="hidden" name="status" value="suspended" /><button className="button button-small button-outline" type="submit">Suspend</button></form>}
              </>}
            </div></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  </div></main>;
}
