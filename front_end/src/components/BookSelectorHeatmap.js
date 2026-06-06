import React from 'react'

const BookSelectorHeatmap = (props) => {


    //convert to wide dataframe:
    const uniqueMembers = props.uniqueValues(props.data, 'value')
    const wideSelectorDf = uniqueMembers.map((mem) => {
        const match1 = props.data.filter((row) => row.value == mem)[0]
        const match2 = props.data.find((row2) => row2.value == mem & row2.BookSelector != match1.BookSelector)
        return({
            Member: mem,
            [`SelectedBy${match1.BookSelector}`]: match1.avgRating,
            [`SelectedBy${match2.BookSelector}`]: match2.avgRating
        })
    })

    console.log('new wide')
    console.log(wideSelectorDf)

    //find the unique keys of the table and then loop through the keysin the table below:
    const df_keys= Object.keys(wideSelectorDf[0])
  return (
    <div className = 'flex justify-center mt-2 p-5'>
       <table  className = 'p-5 border-2 border-gray-500'>
            <thead>
                <tr>
                    <th></th>
                    <th className = 'text-xl px-5'>{df_keys[1]}</th>
                    <th className = 'text-xl px-5'>{df_keys[2]}</th>
                </tr>
            </thead>
            <tbody>
                {wideSelectorDf.map((row) => {
                    return(
                        <tr>
                            <td className = 'border-2 border-gray-500 p-5 '>{row.Member}</td>
                            <td className = 'border-2 border-gray-500 p-5'>{row[df_keys[1]].toFixed(1)}</td>
                            <td className = 'border-2 border-gray-500 p-5'>{row[df_keys[2]].toFixed(1)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default BookSelectorHeatmap
