import { PersonRow } from "./person-row";
import { descendantIds, type OrgPerson } from "@/lib/org";
import { EditPositionButton } from "@/components/org/edit-position";

type TreeProps<T extends OrgPerson> = {
  nodes: T[];
  /** Who reports to whom, keyed by manager id. */
  byManager: Map<string | null, T[]>;
  youId?: string;
  /** Admins get an edit button on every row. */
  canEdit?: boolean;
  /** Link names to profiles (managers and above may open them). */
  linkProfiles?: boolean;
};

/** The hierarchy as an indented tree: every team sits under its manager, with a guide line. */
export function OrgTree<T extends OrgPerson>({ nodes, byManager, youId, canEdit, linkProfiles }: TreeProps<T>) {
  return (
    <ul className="flex flex-col gap-2">
      {nodes.map((person) => {
        const below = byManager.get(person.id) ?? [];
        return (
          <li key={person.id}>
            <PersonRow
              person={person}
              you={person.id === youId}
              teamSize={below.length > 0 ? descendantIds(person.id, byManager).size : 0}
              href={linkProfiles || person.id === youId ? `/people/${person.id}` : undefined}
              action={canEdit ? <EditPositionButton person={person} /> : undefined}
            />
            {below.length > 0 ? (
              <div className="border-line mt-2 ml-5 border-l pl-4">
                <OrgTree
                  nodes={below}
                  byManager={byManager}
                  youId={youId}
                  canEdit={canEdit}
                  linkProfiles={linkProfiles}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
