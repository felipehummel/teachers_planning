// not i18n safe, but it's ok for now
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function Schedule({
  weeks,
  setWeeks,
  selectedDays,
  setSelectedDays,
}: {
  weeks: number
  setWeeks: (weeks: number) => void
  selectedDays: boolean[]
  setSelectedDays: (days: boolean[]) => void
}) {
  const months = weeks > 4 ? Math.floor(weeks / 4) : undefined
  const monthsString = months && months > 1 ? `${months} meses` : `${months} mês`
  const weeksString = weeks > 1 ? `${weeks} semanas` : `${weeks} semana`

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <h3 className="block text-lg font-bold text-foreground">
        Escolha a duração do seu plano de aula
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg border border-primary/30">
        <label className="block text-sm font-medium text-foreground mb-2">
          <strong>Duração:</strong> <span className="text-foreground/80">{weeksString}</span>
          {months && <span className="text-foreground/80 ml-1">({monthsString})</span>}
        </label>
        <input
          type="range"
          min="1"
          max="24"
          value={weeks}
          onChange={e => setWeeks(parseInt(e.target.value))}
          className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-primary/30">
        <label className="block text-sm font-medium text-foreground mb-4">
          <strong>Selecione os dias da semana</strong>
        </label>
        <div className="flex justify-between">
          {weekDays.map((dia, index) => (
            <button
              key={dia}
              type="button"
              onClick={() => {
                const newDays = [...selectedDays]
                newDays[index] = !newDays[index]
                setSelectedDays(newDays)
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm text-sm font-bold ${
                selectedDays[index]
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {dia}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
