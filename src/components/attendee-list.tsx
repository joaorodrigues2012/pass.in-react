import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { IconButton } from "./icon-button";

//import { attendees } from "../data/attendees";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

export function AttendeeList(){

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("search")) {
      return url.searchParams.get("search") ?? "";
    }

    return "";
  });

  const [page, setPage] = useState(() => {

    const url = new URL(window.location.toString());

    if (url.searchParams.has("page")) {
      return Number(url.searchParams.get("page"));
    }

    return 1;
  });

  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const url = new URL("http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees");

    url.searchParams.set('pageIndex', String(page - 1));
    if (search.length > 1) {
      url.searchParams.set("query", search);
    }

    fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAttendees(data.attendees);
      setTotal(data.total);
    });

  }, [page, search]);

  const totalPages = Math.ceil(total / 10);

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());

    url.searchParams.set("search", search);

    window.history.pushState({}, "", url);

    setSearch(search);

  }

  function setCurrentPage(page: number){
    const url = new URL(window.location.toString());

    url.searchParams.set('page', String(page));
    
    window.history.pushState({}, "", url);

    setPage(page);
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  }

  function goToFirstPage(){
    setCurrentPage(1);
  }

  function goToLastPage(){
    setCurrentPage(totalPages);
  }

  function goToNextPage(){
    setCurrentPage(page + 1);
  }

  function goToPreviousPage(){
    setCurrentPage(page - 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
      <h1 className="text-2xl font-bold">Attendees</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300"/>
          <input type="text" placeholder="Search Attendee..."
           className="bg-transparent focus:ring-0 flex-1 outline-none border-0 p-0 text-sm"
           value={search}
           onChange={onSearchInputChanged} />
        </div>
      </div>


      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHeader>
            <TableHeader>Code</TableHeader>
            <TableHeader>Attendee</TableHeader>
            <TableHeader>Registration date</TableHeader>
            <TableHeader>Check-in date</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((ateendee) => {
            return (
              <TableRow key={ateendee.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{ateendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {ateendee.name}
                    </span>
                    <span>{ateendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(ateendee.createdAt)}</TableCell>
                <TableCell>
                  {ateendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Não fez check-in</span>
                  ) : (
                    dayjs().to(ateendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    transparent
                    className="bg-black/20 border border-white/10 rounded-md p-1.5"
                  >
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {total} itens
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Página {page} de {totalPages}
                </span>

                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages || total <= 10}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages || total <= 10}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>

    </div>
  )
}