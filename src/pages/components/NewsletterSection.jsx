import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setOk("");
    setErr("");
    const valid = /^\S+@\S+\.\S+$/.test(email);
    if (!valid) return setErr("Please enter a valid email address.");
    setOk("Subscribed successfully!");
    setEmail("");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div
        className="rounded-2xl border p-6 md:p-8"
        style={{
          borderColor: "rgb(var(--border))",
          background: "rgb(var(--card))",
        }}
      >
        <h2 className="text-2xl font-semibold">Get updates for new tuitions</h2>
        <p className="opacity-80 mt-1">
          Receive email alerts when matching tuitions are posted.
        </p>

        <form
          onSubmit={submit}
          className="mt-5 flex flex-col sm:flex-row gap-3"
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
          <Button type="submit">Subscribe</Button>
        </form>

        {err ? <div className="text-sm mt-2 text-red-500">{err}</div> : null}
        {ok ? <div className="text-sm mt-2 text-green-500">{ok}</div> : null}
      </div>
    </section>
  );
}
