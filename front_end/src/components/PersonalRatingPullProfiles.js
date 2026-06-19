import React from 'react'
import { mean, standardDeviation, median }  from 'simple-statistics'
import PersonalRatingsDisplayProfiles from './PersonalRatingsDisplayProfiles'

const PersonalRatingProfilesAnalysis = (props) => {

    console.log('props data')
    console.log(props.data)
    const favorites = props.data.filter((row) => row.Rating >= 9)
    const favoritesByGenre = props.sort_table(props.avgByGenre(favorites, 1, true), 'numBooksWithHalfs', false)
    const favoritesTopGenres = favoritesByGenre.length < 3 ? favoritesByGenre : favoritesByGenre.slice(0,3)
    const favoritesByAuthor = props.sort_table(props.groupBy(favorites, 'Author', 2), 'count', false)
    const favoritesTopAuthor = favoritesByAuthor.length == 0 ? null : favoritesByAuthor.slice(0,1)
    const favoritesBySelector = props.sort_table(props.groupBy(favorites, 'BookSelector', 0), 'count', false)

    const secondGroup = props.data.filter((row) => row.Rating < 9 && row.Rating >= 7)
    const secondGroupByGenre = props.sort_table(props.avgByGenre(secondGroup, 1, true), 'numBooksWithHalfs', false)
    const secondGroupTopGenres = secondGroupByGenre.length < 3 ? secondGroupByGenre : secondGroupByGenre.slice(0,3)
    const secondGroupByAuthor = props.sort_table(props.groupBy(secondGroup, 'Author', 2), 'count', false)
    const secondGroupTopAuthor = secondGroupByAuthor?.length == 0 ? null : secondGroupByAuthor.slice(0,1)
    const secondGroupBySelector = props.sort_table(props.groupBy(secondGroup, 'BookSelector', 0), 'count', false)

    const middleGroup = props.data.filter((row) => row.Rating <= 6 && row.Rating >= 4)
    const middleGroupByGenre = props.sort_table(props.avgByGenre(middleGroup, 1, true), 'numBooksWithHalfs', false)
    const middleGroupTopGenres = middleGroupByGenre.length < 3 ? middleGroupByGenre : middleGroupByGenre.slice(0,3)
    const middleGroupByAuthor = props.sort_table(props.groupBy(middleGroup, 'Author', 2), 'count', false)
    const middleGroupTopAuthor = middleGroupByAuthor?.length == 0 ? null : middleGroupByAuthor.slice(0,1)
    const middleGroupBySelector = props.sort_table(props.groupBy(middleGroup, 'BookSelector', 0), 'count', false)

    const lowGroup = props.data.filter((row) => row.Rating < 4)
    const lowGroupByGenre = props.sort_table(props.avgByGenre(lowGroup, 1, true), 'numBooksWithHalfs', false)
    const lowGroupTopGenres = middleGroupByGenre.length < 3 ? lowGroupByGenre : lowGroupByGenre.slice(0,3)
    const lowGroupByAuthor = props.sort_table(props.groupBy(lowGroup, 'Author', 2), 'count', false)
    const lowGroupTopAuthor = lowGroupByAuthor?.length == 0 ? null : lowGroupByAuthor.slice(0,1)
    const lowGroupBySelector = props.sort_table(props.groupBy(lowGroup, 'BookSelector', 0), 'count', false)
    


  return (
    <div className = 'flex grid grid-cols-4'>
        <PersonalRatingsDisplayProfiles groupData = {favorites} groupTitle = "Profile of Favorites (Rating 9-10)" groupGenres = {favoritesTopGenres} groupAuthor = {favoritesTopAuthor}/>
        <PersonalRatingsDisplayProfiles groupData = {secondGroup} groupTitle = "Profile of High Rated Books (Rating 7-8)" groupGenres = {secondGroupTopGenres} groupAuthor = {secondGroupTopAuthor}/>
        <PersonalRatingsDisplayProfiles groupData = {middleGroup} groupTitle = "Profile of Medium Rated Books (Rating 4-6)" groupGenres = {middleGroupTopGenres} groupAuthor = {middleGroupTopAuthor}/>
        <PersonalRatingsDisplayProfiles groupData = {lowGroup} groupTitle = "Profile of Low Rated Books (Rating 1-3)" groupGenres = {lowGroupTopGenres} groupAuthor = {lowGroupTopAuthor}/>
    </div>
  )
}

export default PersonalRatingProfilesAnalysis