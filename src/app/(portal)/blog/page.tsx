import { RiAddLine, RiExternalLinkLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { blogPosts, type Tone } from "@/lib/mock-data";

const statusTone: Record<string, Tone> = {
  Published: "success",
  Scheduled: "accent",
  "In review": "warning",
  Draft: "neutral",
};

const counts = ["Published", "Scheduled", "In review", "Draft"].map((status) => ({
  status,
  count: blogPosts.filter((post) => post.status === status).length,
}));

export default function BlogPage() {
  return (
    <>
      <PageHeader
        pretitle="Website"
        title="Blog"
        actions={
          <>
            <Button variant="secondary">
              <RiExternalLinkLine size={18} aria-hidden />
              View site
            </Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              New post
            </Button>
          </>
        }
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        Posts written here publish to the blog section of the CVSpan website. Anything in review
        needs an admin approval before it goes live.
      </p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.status} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {item.status}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{item.count}</p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="All posts" action={<Badge>{blogPosts.length} posts</Badge>} />
        <Table>
          <Thead columns={["Title", "Author", "Category", "Updated", "Status", ""]} />
          <tbody>
            {blogPosts.map((post) => (
              <Tr key={post.id}>
                <Td className="text-primary font-semibold">{post.title}</Td>
                <Td>
                  <span className="flex items-center gap-2">
                    <span className="bg-accent-soft text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                      {post.initials}
                    </span>
                    <span className="whitespace-nowrap">{post.author}</span>
                  </span>
                </Td>
                <Td>{post.category}</Td>
                <Td className="whitespace-nowrap">{post.updated}</Td>
                <Td>
                  <Badge tone={statusTone[post.status]}>{post.status}</Badge>
                </Td>
                <Td className="whitespace-nowrap">
                  <span className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    {post.status === "In review" ? <Button size="sm">Approve</Button> : null}
                  </span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
