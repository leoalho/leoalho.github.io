import fs from "fs";
import path from "path";

const linksDirectory = path.join(process.cwd(), "src", "links");

export const getLinksData = () => {
    // THe file is in csv and not json, because csv is easier to write manually.
    // Currently just one file, but I anticipate to have several files in the future
    const linksFilePath = path.join(linksDirectory, "links.csv")
    const linksData = fs.readFileSync(linksFilePath, "utf-8")

    const headerArray = linksData.split("\n")[0].split(",")
    const rows = linksData.split("\n").slice(1)

    const rowsJSON = rows.map(( row) => {
        const rowArray = row.split(",")
        const rowObject = headerArray.reduce((accumulator, title, index) => {
            const newAccumulator: any = {...accumulator}
            if (rowArray[index]){
                newAccumulator[title] = rowArray[index]
            }
            return newAccumulator}, {})
        return rowObject
    })

    return rowsJSON
}


