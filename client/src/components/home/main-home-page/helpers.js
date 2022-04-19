export const indexToRowStyle = (index) => {
    if (index === 0) {
        return "compare-table-champions"
    } else if (index >=1 && index <= 3) {
        return "compare-table-top-four"
    } else if (index >= 17) {
        return "compare-table-relegation"
    } else {
        return "compare-table-other"
    }
}

export const pointsToColorStyle = (points) => {
    if (points === 0) {
        return 'zero_points'
    } else if (points > 0) {
        return'positive_points'
    } else {
        return 'negative_points'
    }
}