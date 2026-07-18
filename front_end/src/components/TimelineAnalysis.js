import React, {useState, useEffect} from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';



const TimelineAnalysis = (props) => {

  const [selectedFilterAuthor, setSelectedFilterAuthor] = useState('All Authors')
  useEffect(() => setSelectedFilterAuthor('All Authors'), [props.data])
  console.log('selected author')
  console.log(selectedFilterAuthor)

    console.log(props.data)
    

    const topReadAuthors = props.sort_table(props.groupBy(props.data, 'Author', 3), 'value', true).map((row) => row.value)
    console.log(topReadAuthors)

    const plotData = selectedFilterAuthor == 'All Authors' ? props.data : props.data.filter((row) => row.Author == selectedFilterAuthor)
    const years = plotData.map((row) => row.Year)
    console.log(years)
    const numYears = Math.max(...years) - Math.min(...years) + 1
    console.log('numyears')
    console.log(numYears)

    const dataWithDecade = plotData.map((row) => ({
        ...row,
        Decade: `${Math.floor(row.Year/10)*10}'s`
    }))
    console.log(dataWithDecade)

    

    const decadeGroups = props.sort_table(props.groupBy(dataWithDecade, 'Decade', 1), 'avgRating', false)
    console.log(decadeGroups)
    const CustomTooltip = ({active, payload}) => {
      if(active && payload && payload.length) {
        const book = payload[0].payload

        return(
          <div className = 'bg-white border-2 break-words '>
            <div className = 'flex gap-3 mr-5'>
              <img src = {book.Thumbnail}/>
              <div className  = 'flex-1 justify-center'>
                <p>{book.Book} by {book.Author}</p>
                <p>Published: {book.Year}</p>
                <p>Rating: {book.Rating}</p>
                {book.start_date && book.end_date ? (<p>Read from {book.start_date} to {book.end_date}</p>) : null}
              </div>
            </div>
          </div>
        )
      }
    }
    

  return (
    <div className = ' bg-green-100'>
      {topReadAuthors.length > 0 && 
      (<div className = 'flex justify-end p-4'>
        <select className = 'text-center border rounded-full p-1 border-gray-500' onChange = {(e) => setSelectedFilterAuthor(e.target.value)} value = {selectedFilterAuthor}>
          <option>All Authors</option>
          {topReadAuthors.map((author) => 
          (<option>{author}</option>))}
        </select>
        </div>)
      }
      <div className = 'grid xl:grid-cols-[3fr_1fr] p-6'>
        <div className = 'w-full h-[400px] mb-10'>
          <h1 className = 'font-bold pb-5 text-xl'>Do you prefer older books or newer books{selectedFilterAuthor == 'All Authors' ? '' : ` by ${selectedFilterAuthor}`}?</h1>
          <ResponsiveContainer width="100%" height = "90%">
            <ScatterChart margin={{ top: 20, right: 10, bottom: 40, left: 10 }}>
            <CartesianGrid />
            <XAxis tickFormatter={(value) => Math.round(value)} label = {{value: 'Year Published', position :'insideBottom', offset: -25}} type = 'number' scale = 'linear' domain={['dataMin-1', 'dataMin+1']}  tickCount={Math.min(numYears, 20)} dataKey="Year" name="Year Published" />
            <YAxis dataKey="Rating" name="Rating" domain={[1, 10]} tickCount = {10}/>
            <Tooltip content={<CustomTooltip/>}  isAnimationActive = {false} position = {typeof window !== 'undefined' && window.innerWidth < 768 ? { x: 0, y: 0 } : undefined}/>
            <Scatter name="Books" data= {props.sort_table(plotData, 'Year', true)} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className = 'flex justify-center'>
          <table className = 'border border-2  border-gray-800 m-auto items-center'>
            <thead>
              <th></th>
              <th className = 'px-2'>Avg Rating</th>
              <th className = 'px-2'># Books</th>
              <th className = 'px-2'> Consistency </th>
            </thead>
            <tbody>
              {decadeGroups.map((decade) => {
              return (
              <tr>
                <td className = 'border border-gray-800 px-4 text-center'>{decade.value}</td>
                <td className = 'border border-gray-800 px-4 text-center'>{decade.avgRating.toFixed(2)}</td>
                <td className = 'border border-gray-800 px-4 text-center'>{decade.count}</td>
                <td className = 'border border-gray-800 px-4 text-center'> {decade.sdRating <= 0.75 ? 'Very High' : decade.sdRating <= 1.25 ? 'High' : decade.sdRating <= 2 ? 'Medium' : 'Hit or Miss'}</td>
              </tr> 
              )
              })}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TimelineAnalysis
