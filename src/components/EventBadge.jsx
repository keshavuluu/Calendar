import React from 'react'

export default function EventBadge({ event, className, onClick, highlight }) {
	const bg = event.color || '#1a73e8'
	return (
		<button
			className={`w-full truncate rounded px-1 py-0.5 text-left text-[11px] text-white hover:opacity-90 focus:outline-none ${highlight ? 'ring-2 ring-yellow-300 ring-offset-1' : 'focus:ring-2 focus:ring-offset-2'} ${className || ''}`}
			style={{ backgroundColor: bg }}
			onClick={onClick}
			aria-label={`${event.title} ${event.startTime}-${event.endTime}`}
		>
			<span className="font-medium">{event.title}</span>
		</button>
	)
}