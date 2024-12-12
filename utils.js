import axios from "axios"
import { number, input, select, Separator } from "@inquirer/prompts"
// import DatePrompt from "inquirer-date-prompt"

import * as colors from "colors"
import pad from "pad"
import boxen from "boxen"

//https://api.github.com/search/repositories?q=created:2024-10-20..2024-10-27&sort=stars&order=desc



export async function searchByDate() {
  //Input Dates Numbers
  console.log("\nWrite from and until what date the most starred repos are going to show (numeric)".blue)
  let dates = {}
  await questions().then(res => {
    dates = res;
  })

  // Check Time Travel
  if (dates.fy == dates.ty) {
    if (dates.fm == dates.tm) {
      if (dates.fd > dates.td) {
        errorTimeTravel()
      }
    }
    if (dates.fm > dates.tm) {
      errorTimeTravel()
    }
  }


  const number = await select({
    message: "How many repos info do you want to see",
    choices: [
      { name: '1', value: 1, description: "The most starred repo only" },
      { name: '2', value: 2, description: "The 2 most starred repo only" },
      { name: '3', value: 3, description: "The 3 most starred repo only" }
    ]
  })
  callGH(dates, number)
}

async function questions() {
  const fd = await number({ message: "From what day", required: true, max: 31, min: 1 })
  const fm = await number({ message: "of what month?", required: true, max: 12, min: 1 })
  const fy = await number({ message: "of what year?", required: true, max: 2025, min: 2000 })

  const td = await number({ message: "\nUntil what day", required: true, max: 31, min: 1 })
  const tm = await number({ message: "of what month?", required: true, max: 12, min: 1 })
  const ty = await number({ message: "of what year?", required: true, max: 2025, min: fy })

  return { fd: fd, fm: fm, fy: fy, td: td, tm: tm, ty: ty }
}

function errorTimeTravel() {
  console.error("\nYou can't time travel yet".red)
  console.log("Try again\n")
  searchByDate()
}

async function callGH(dates, num) {
  const newDates = [dates.fd, dates.fm, dates.fy, dates.td, dates.tm, dates.ty]
  // console.log(fd, fm, fy, td, tm, ty)
  for (let i = 0; i < newDates.length; i++) {
    if (newDates[i] < 10) {
      newDates[i] = `0${newDates[i]}`
    }
  }
  const { fy, fm, fd, ty, tm, td } = {
    fy: newDates[2], fm: newDates[1], fd: newDates[0], ty: newDates[5], tm: newDates[4], td: newDates[3]
  }
  // console.log(`\nLast log: ${fy}-${fm}-${fd} // ${ty}-${tm}-${td}`)
  // console.log(num)

  const github = await fetch(`https://api.github.com/search/repositories?q=created:${fy}-${fm}-${fd}..${ty}-${tm}-${td}&sort=stars&order=desc`)
  // const github = await fetch(`https://api.github.com/search/repositories?q=created:2024-02-27..2024-02-28&sort=stars&order=desc`)
  if (github.status == 200) {
    // console.log("Got the sauce")
    const githubJson = await github.json()

    showTheRepo(githubJson.items[0], 1, 'yellow')
    if (num > 1) {
      showTheRepo(githubJson.items[1], 2, 'gray')
    }
    if (num > 2) {
      showTheRepo(githubJson.items[2], 3, 'red')
    }
  }

}

function showTheRepo(item, pos, color) {

  console.log(boxen(
    `
    Repo Full-Name: ${item.full_name} \n
    Description: ${item.description}\n
    Owner: ${item.owner.login} \n
    Repo Link: ${item.html_url}\n\n

    Stars: ${item.stargazers_count}\n
    Language: ${item.language}\n
    Created: ${item.created_at}\n
    Homepage: ${item.homepage}\n
    `
    , { title: `Position ${pos}`, titleAlignment: 'center', padding: 0, margin: 0, borderColor: color, borderStyle: 'double' }))
}



export function fakeGHFetch() {
  const newDates = [27, 2, 2024, 28, 2, 2024]
  for (let i = 0; i < newDates.length; i++) {
    if (newDates[i] < 10) {
      newDates[i] = `0${newDates[i]}`
    }
  }
  console.log(newDates)
  const { fy, fm, fd, ty, tm, td } = {
    fy: newDates[2], fm: newDates[1], fd: newDates[0], ty: newDates[5], tm: newDates[4], td: newDates[3]
  }
  console.log(`Last log: ${fy}-${fm}-${fd} // ${ty}-${tm}-${td}`)
  axios
    .get(`https://api.github.com/search/repositories?q=created:${fy}-${fm}-${fd}..${ty}-${tm}-${td}&sort=stars&order=desc`)
    // .get(`https://api.github.com/search/repositories?q=created:2024-10-27..2024-10-28&sort=stars&order=desc`)
    .then(res => {
      const starred1 = res.data.items[0]
      showTheRepo(starred1)
    })
    .catch(err => {
      console.log(err)
    })
  console.log(starred1)
}