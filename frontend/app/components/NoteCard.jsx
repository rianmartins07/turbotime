'use client'

export default function NoteCard({ note, onClick }) {
  return (
    <div
      onClick={() => onClick(note.id)}
      className="flex flex-col gap-3 lg:gap-[12px] justify-start items-start w-full aspect-square shadow-[1px_1px_2px_#0000003f] rounded-[10px] p-4 lg:p-[16px] cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
      style={{ 
        backgroundColor: note.backgroundColor,
        border: `3px solid ${note.borderColor}`
      }}
    >
      <div className="flex flex-row justify-start items-center w-full break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
        <span className="text-[12px] font-inter font-bold leading-[15px] text-left text-black">
          {note.date}
        </span>
        <span className="text-[12px] font-inter font-normal leading-[15px] text-left text-black ml-2">
          {note.category}
        </span>
      </div>

      <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] font-inria-serif font-bold leading-[22px] sm:leading-[25px] lg:leading-[29px] text-left text-black w-full break-words">
        {note.title}
      </h3>

      <p className="text-[12px] font-inter font-normal leading-[14px] text-left text-black w-full break-words flex-1 whitespace-pre-line">
        {note.content}
      </p>
    </div>
  )
}
