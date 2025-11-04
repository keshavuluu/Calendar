import React, { useMemo, useState } from "react";
import eventsData from "./data/events.json";
import {
  fmt,
  getMonthMatrix,
  isToday,
  isPastDay,
  monthAdd,
  sameMonth,
  toIso,
  fromIso,
} from "./lib/date";
import EventBadge from "./components/EventBadge";
function Header({
  activeDate,
  onPrev,
  onNext,
  onToday,
  query,
  onQueryChange,
  onClear,
  onAddEvent,
}) {
  const [openPicker, setOpenPicker] = useState(false);
  const [showYearGrid, setShowYearGrid] = useState(false);

  const getYearGrid = (year) => {
    const start = year - 6;
    return Array.from({ length: 12 }, (_, i) => start + i);
  };

  const yearGrid = getYearGrid(activeDate.getFullYear());

  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">

          <button
            className="rounded-md border bg-white px-3 py-2 shadow-sm hover:bg-gray-100"
            onClick={() => {
              const d = new Date(activeDate);
              d.setFullYear(activeDate.getFullYear() - 1);
              window.dispatchEvent(
                new CustomEvent("calendar:setActive", { detail: d })
              );
            }}
          >
            «
          </button>


          <button
            className="rounded-md border bg-white px-3 py-2 shadow-sm hover:bg-gray-100"
            onClick={onPrev}
          >
            &lt;
          </button>

          <div className="relative">
            <button
              className="text-left"
              onClick={() => setOpenPicker((v) => !v)}
            >
              <h1 className="text-3xl font-bold tracking-tight">
                {fmt.monthYear(activeDate)}
              </h1>
            </button>

            {openPicker && (
              <div className="absolute z-10 mt-2 w-[320px] rounded-lg border bg-white p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  {!showYearGrid ? (
                    <>
                      <button
                        className="btn"
                        onClick={() => {
                          const d = new Date(activeDate);
                          d.setFullYear(activeDate.getFullYear() - 1);
                          window.dispatchEvent(
                            new CustomEvent("calendar:setActive", { detail: d })
                          );
                        }}
                      >
                        Prev
                      </button>
                      <button
                        className="text-sm font-semibold hover:text-blue-600"
                        onClick={() => setShowYearGrid(true)}
                      >
                        {activeDate.getFullYear()}
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          const d = new Date(activeDate);
                          d.setFullYear(activeDate.getFullYear() + 1);
                          window.dispatchEvent(
                            new CustomEvent("calendar:setActive", { detail: d })
                          );
                        }}
                      >
                        Next
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-sm font-semibold text-blue-600 hover:underline"
                      onClick={() => setShowYearGrid(false)}
                    >
                      Back to Months
                    </button>
                  )}
                </div>

                {showYearGrid ? (
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {yearGrid.map((year) => (
                      <button
                        key={year}
                        className={`rounded px-2 py-2 hover:bg-gray-100 ${
                          year === activeDate.getFullYear()
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : ""
                        }`}
                        onClick={() => {
                          const d = new Date(activeDate);
                          d.setFullYear(year);
                          window.dispatchEvent(
                            new CustomEvent("calendar:setActive", { detail: d })
                          );
                          setShowYearGrid(false);
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mb-3 grid grid-cols-4 gap-1">
                      {Array.from({ length: 12 }, (_, i) => (
                        <button
                          key={i}
                          className={`rounded px-2 py-1 text-xs hover:bg-gray-100 ${
                            activeDate.getMonth() === i
                              ? "bg-blue-50 text-brand"
                              : ""
                          }`}
                          onClick={() => {
                            const d = new Date(activeDate.getFullYear(), i, 1);
                            window.dispatchEvent(
                              new CustomEvent("calendar:setActive", {
                                detail: d,
                              })
                            );
                            setOpenPicker(false);
                          }}
                        >
                          {new Date(2000, i, 1).toLocaleString(undefined, {
                            month: "short",
                          })}
                        </button>
                      ))}
                    </div>
                    <MiniMonth
                      activeDate={activeDate}
                      selectedIso={null}
                      onSelect={(iso) => {
                        window.dispatchEvent(
                          new CustomEvent("calendar:setSelectedIso", {
                            detail: iso,
                          })
                        );
                        setOpenPicker(false);
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>


          <button
            className="rounded-md border bg-white px-3 py-2 shadow-sm hover:bg-gray-100"
            onClick={onNext}
          >
            &gt;
          </button>


          <button
            className="rounded-md border bg-white px-3 py-2 shadow-sm hover:bg-gray-100"
            onClick={() => {
              const d = new Date(activeDate);
              d.setFullYear(activeDate.getFullYear() + 1);
              window.dispatchEvent(
                new CustomEvent("calendar:setActive", { detail: d })
              );
            }}
          >
            »
          </button>

          <button className="btn btn-primary ml-2" onClick={onToday}>
            Today
          </button>
        </div>


        <div className="flex items-start gap-4">
          <div className="relative">
            <input
              className="h-10 w-[280px] rounded-md border border-gray-300 bg-white pl-10 pr-10 text-sm shadow-sm focus:border-brand focus:outline-none"
              type="search"
              placeholder="Search events..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
            <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
              🔎
            </span>
            {query && (
              <button
                onClick={onClear}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={onAddEvent}>
            + Add Event
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniMonth({ activeDate, selectedIso, onSelect }) {
  const days = getMonthMatrix(activeDate);
  const firstDayLabel = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm">
      <div className="mb-2 text-sm font-semibold">
        {fmt.monthYear(activeDate)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-500">
        {firstDayLabel.map((d) => (
          <div key={d}>{d}</div>
        ))}
        {days.map((d) => {
          const iso = toIso(d);
          const isSel = iso === selectedIso;
          return (
            <button
              key={iso}
              onClick={() => onSelect(iso)}
              className={`aspect-square rounded text-[11px] ${
                sameMonth(d, activeDate) ? "" : "text-gray-400"
              } ${
                isSel
                  ? "bg-brand text-white"
                  : isToday(d)
                  ? "bg-brand-soft text-brand"
                  : "hover:bg-gray-100"
              }`}
            >
              {fmt.dayNum(d)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayCell({ date, inMonth, events, onOpenDay, query }) {
  const iso = toIso(date);
  const cellEvents = events.filter((e) => e.date === iso);
  const overlaps = (() => {
    const toMin = (t) => {
      const [h, m] = (t || "0:0").split(":").map(Number);
      return h * 60 + m;
    };
    const sorted = [...cellEvents].sort((a, b) => toMin(a.startTime) - toMin(b.startTime));
    let conflict = false;
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = toMin(sorted[i - 1].endTime);
      const curStart = toMin(sorted[i].startTime);
      if (curStart < prevEnd) {
        conflict = true;
        break;
      }
    }
    return conflict;
  })();
  const visible = cellEvents.slice(0, 2);
  const hidden = cellEvents.length - visible.length;
  const past = isPastDay(date);

  return (
    <div
      className={`h-32 rounded-2xl border p-3 shadow-sm ${
        inMonth ? "bg-white" : "bg-gray-50 text-gray-400"
      } ${!past ? "cursor-pointer hover:bg-gray-50" : ""}`}
      onClick={() => !past && onOpenDay(iso)}
    >
      <div className="mb-1 flex items-center justify-between">
        <div
          className={`h-7 w-7 select-none rounded-full text-center text-s leading-7 font-semibold ${
            isToday(date) ? "bg-brand text-white" : ""
          }`}
        >
          {fmt.dayNum(date)}
        </div>
        {overlaps && (
          <span className="rounded bg-red-100 px-1 text-[10px] font-medium text-red-700">
            conflict
          </span>
        )}
        <button
          className={`rounded px-1 text-xs ${
            past
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-400 hover:bg-gray-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            !past && onOpenDay(iso);
          }}
          disabled={past}
        >
          ＋
        </button>
      </div>

      <div className="space-y-1">
        {visible.map((ev) => (
          <EventBadge
            key={ev.id}
            event={ev}
            onClick={() => onOpenDay(iso)}
            highlight={
              query && ev.title.toLowerCase().includes(query.toLowerCase())
            }
          />
        ))}
        {hidden > 0 && (
          <button
            onClick={() => onOpenDay(iso)}
            className="w-full truncate rounded px-1 py-0.5 text-left text-[11px] text-brand hover:bg-brand-soft"
          >
            +{hidden} more
          </button>
        )}
      </div>
    </div>
  );
}

function MonthGrid({ activeDate, events, onOpenDay, query }) {
  const days = getMonthMatrix(activeDate);
  const weekLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="grid grid-cols-7 gap-6 px-6 pb-4 pt-6 text-center text-gray-600">
        {weekLabels.map((l) => (
          <div key={l} className="text-lg font-semibold">
            {l}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-6 p-6">
        {days.map((d, i) => (
          <DayCell
            key={i}
            date={d}
            inMonth={sameMonth(d, activeDate)}
            events={events}
            onOpenDay={onOpenDay}
            query={query}
          />
        ))}
      </div>
    </div>
  );
}

function DayDrawer({ openIso, onClose, events, onAdd, onRemove }) {
  if (!openIso) return null;
  const day = fromIso(openIso);
  const dayEvents = events.filter((e) => e.date === openIso);
  const [error, setError] = useState("");
  let titleRef, startRef, endRef;

  function submit(e) {
    e.preventDefault();
    const toMinutes = (t) => {
      const [h, m] = (t || "0:0").split(":").map(Number);
      return h * 60 + m;
    };
    const start = startRef.value || "09:00";
    const end = endRef.value || "10:00";
    if (toMinutes(end) <= toMinutes(start)) {
      setError("End time must be after start time.");
      return;
    }
    setError("");
    const newEvent = {
      id: Math.random().toString(36).slice(2),
      date: openIso,
      title: titleRef.value.trim() || "New Event",
      startTime: start,
      endTime: end,
      color: "#1a73e8",
    };
    onAdd(newEvent);
    titleRef.value = "";
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <div className="w-full max-w-md border-l bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {fmt.monthYear(day)} {fmt.dayNum(day)}
          </h2>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={submit} className="mb-4 grid grid-cols-3 gap-2">
          <input
            ref={(el) => (titleRef = el)}
            className="col-span-3 rounded border px-2 py-1"
            placeholder="Event title"
          />
          <input
            ref={(el) => (startRef = el)}
            type="time"
            className="rounded border px-2 py-1"
            defaultValue="09:00"
          />
          <input
            ref={(el) => (endRef = el)}
            type="time"
            className="rounded border px-2 py-1"
            defaultValue="10:00"
          />
          <button className="btn btn-primary">Add</button>
        </form>

        {error && (
          <div className="mb-2 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {dayEvents.length === 0 && (
            <div className="text-sm text-gray-500">No events</div>
          )}
          {dayEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between rounded border p-2"
            >
              <div>
                <div className="text-sm font-medium">{ev.title}</div>
                <div className="text-xs text-gray-500">
                  {ev.startTime} – {ev.endTime}
                </div>
              </div>
              <button
                className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                onClick={() => onRemove(ev.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedIso, setSelectedIso] = useState(null);
  const [openIso, setOpenIso] = useState(null);
  const [events, setEvents] = useState(eventsData);
  const [query, setQuery] = useState("");
  const [view] = useState("month");

  const onPrev = () => setActiveDate((d) => monthAdd(d, -1));
  const onNext = () => setActiveDate((d) => monthAdd(d, 1));
  const onToday = () => setActiveDate(new Date());
  const onOpenDay = (iso) => {
    setSelectedIso(iso);
    setOpenIso(iso);
  };
  const onAdd = (ev) => setEvents((prev) => [...prev, ev]);

  useMemo(() => {
    if (!selectedIso) return;
    const d = fromIso(selectedIso);
    setActiveDate(d);
  }, [selectedIso]);

  React.useEffect(() => {
    function onSetActive(e) {
      const d = e.detail;
      if (d instanceof Date && !isNaN(d)) {
        setActiveDate(d);
      }
    }
    function onSetSelectedIso(e) {
      const iso = e.detail;
      if (typeof iso === "string") {
        setSelectedIso(iso);
        setOpenIso(iso);
      }
    }
    window.addEventListener("calendar:setActive", onSetActive);
    window.addEventListener("calendar:setSelectedIso", onSetSelectedIso);
    return () => {
      window.removeEventListener("calendar:setActive", onSetActive);
      window.removeEventListener("calendar:setSelectedIso", onSetSelectedIso);
    };
  }, []);

  useMemo(() => {
    if (!query) return;
    const q = query.toLowerCase();
    const match = events
      .filter((e) => e.title.toLowerCase().includes(q))
      .sort((a, b) => (a.date < b.date ? -1 : 1))[0];
    if (match) {
      const d = fromIso(match.date);
      if (!sameMonth(d, activeDate)) setActiveDate(d);
    }
  }, [query, events]);

  const filteredEvents = useMemo(() => {
    if (!query) return events;
    const q = query.toLowerCase();
    return events.filter((e) => e.title.toLowerCase().includes(q));
  }, [events, query]);

  const onRemove = (id) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
        📅 Calendar
      </h1>
      <div className="flex gap-6">
        
        <div className="flex-1">
          <Header
            activeDate={activeDate}
            onPrev={onPrev}
            onNext={onNext}
            onToday={onToday}
            query={query}
            onQueryChange={setQuery}
            onClear={() => setQuery("")}
            onAddEvent={() => onOpenDay(toIso(activeDate))}
          />
          <div>
            {view === "month" && (
              <MonthGrid
                activeDate={activeDate}
                events={filteredEvents}
                onOpenDay={onOpenDay}
                query={query}
              />
            )}
          </div>
          <DayDrawer
            openIso={openIso}
            onClose={() => setOpenIso(null)}
            events={events}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </div>
      </div>
    </div>
  );
}