const fs = require("fs")
const client = require('discord-rich-presence')('825727938942861342');
const { exec } = require("child_process")
presence_exists = null
rich_running = false
animation_so_ignore = false
ugh_pres = false
main_menu_state = null

Object.prototype.close_tab = function() { this.send("<script>window.close()</script>") }



const { app, BrowserWindow, ipcMain} = require('electron')
const remote = require("electron").remote
const ipcRenderer = require("electron").ipcRenderer;
let win;
app.whenReady().then(ready => {
	win = new BrowserWindow({ width: 800, height: 600, webPreferences: {nodeIntegration: true, contextIsolation: false}})
	var tmp_exe_data = fs.readFileSync(__dirname + "\\EXEs.data").toString().split("\n").slice(0, -1).map(data=>data.replace("\r",""))
	var exe_data =[]
	tmp_exe_data.map(exe => exe_data.push({
		name: exe.split(",")[0],
		dir: exe.split(",")[1]
	}))
	win.loadFile("index.html")
	win.setTitle("Choose a FNF executable"); win.setIcon("icon.ico");//win.removeMenu(); 
	win.webContents.send("init-exe-dropdown", exe_data)

})

ipcMain.on("new-exe", (event, data) => {
	data = data.split("\\")
	if (data.slice(-1)[0].split(".").slice(-1) == "exe") {

		exe_data = {
			name: data.slice(-1)[0],
			dir: data.slice(0, -1).join("\\")
		}

		fs.appendFileSync(__dirname + "\\EXEs.data", `${exe_data.name},${exe_data.dir}\n`)

		event.reply("init-exe-dropdown", [exe_data])

	}
})


ipcMain.on("play-fnf", (event, data) => {
	var fnf_exe;
	fs.readFileSync(__dirname + "\\EXEs.data").toString().split("\n").slice(0, -1).map(data=>data.replace("\r","")).forEach(exe => {
		if (exe.split(",")[0] == data) { 
			fnf_exe = {
				name: exe.split(",")[0],
				dir: exe.split(",")[1]
			}
		}
	})

	win.hide()
	process.chdir(fnf_exe.dir)
	var child = exec(`"${fnf_exe.dir}\\${fnf_exe.name}"`)
	started = Date.now()

	rich_running = true
	exec("title Friday Night Funkin' Rich Presence")
	console.log("Rich Presence enabled")
	client.updatePresence({
		state: fnf_exe.name.replace(".exe","") + " Mod",
		details: "Getting ready to funk",
		largeImageKey: "homepage",
		instance: true, 
		startTimestamp: started
	});

	child.stdout.on("data", fnf_output => {

		if (!rich_running) {

		}
 		
			
		String.prototype.get_created_character = function() {
			event_message = this + ""
			if (event_message.includes("dad")) { return("dad") }
			if (event_message.includes("spooky")) { return("skid_and_pump") }
			if (event_message.includes("monster") && !event_message.includes("monster-christmas")) { return("lemon_demon") }
			if (event_message.includes("pico")) { return("pico") }
			if (event_message.includes("mom-car")) { return("mom") }
			if (event_message.includes("parents-christmas")) { return("mom_and_dad") }
			if (event_message.includes("monster-christmas")) { return("christmas_lemon_demon") }
			if (event_message.includes("senpai") && !event_message.includes("senpai-angry")) { return("senpai_1") }
			if (event_message.includes("senpai-angry")) { return("senpai_2") }
			if (event_message.includes("spirit")) { return("senpai_3") }
			if (event_message.includes("whitty") && !event_message.includes("whittyCrazy")) { return("whitty_1") }
			if (event_message.includes("whittyCrazy")) { return("whitty_2") }

			
		}

		String.prototype.contains_any_of = function(array) {
			contains = false
			array.forEach(element => {
				if ((this+"").toLowerCase().includes(element)) { contains = true; console.log(`${this+""} includes ${element}`) }
			})
			if (contains == true) {
				console.log(`contains: ${contains}`)
				return contains
			} else { return false }
		}

		String.prototype.find_song = function() {
			found_song = null
			Object.keys(songs).forEach(owner => {
				songs[owner].forEach(song => {
					console.log(this)
					if ((this+"").toLowerCase().includes(song)) { found_song = song; console.log("found it!")}
				})
			})
			console.log(`found song ${found_song}`)
			return found_song
		}

		String.prototype.find_song_owner = function() {
			find_owner = null
			Object.keys(songs).forEach(owner => {
				if ((this+"").contains_any_of(songs[owner])) { find_owner = owner }
			})
			console.log(`find owner: ${find_owner}`)
			return find_owner
		}

		String.prototype.title = function() {
			titled_string = ""
			string = this + ""
			string.split(" ").forEach(word => { titled_string += ( word[0].toUpperCase() + word.slice(1).toLowerCase() + " ") })
			return titled_string
		}

		String.prototype.get_week = function() {
			song_char = (this + "").toLowerCase()
			if (["dad"].includes(song_char)) { return "Week 1" }
			if (["skid_and_pump"].includes(song_char)) { return "Week 2" }
			if (["pico"].includes(song_char)) { return "Week 3" }
			if (["mom"].includes(song_char)) { return "Week 4" }
			if (["mom_and_dad","christmas_lemon_demon"].includes(song_char)) { return "Week 5" }
			if (["senpai_1","senpai_2","senpai_3"].includes(song_char)) { return "Week 6" }
			if (["whitty_1","whitty_2"].includes(song_char)) { return "Bonus Week" }
			return "Modded Week"
			
		}

		function story_rich_pres(output_data) {
			animation_so_ignore = true
			setTimeout(() => { animation_so_ignore = false; console.log("SET FALSE")}, 4000) // random musicbeatstate is logged for some reason, about 2 seconds after char is created for animation. DOing this is a hacky method to stop it
			song_owner = output_data.get_created_character()
			console.log(formatted_song_owner(output_data.get_created_character()))
			if (formatted_song_owner(output_data.get_created_character()) != undefined) {
				if (main_menu_state == "story") {
					presence_details = song_owner.get_week()}
				client.updatePresence({
					state: fnf_exe.name.replace(".exe",""),
					details: "Playing "+presence_details,
					largeImageKey: output_data.get_created_character(),
					instance: true,
					startTimestamp: started
				});
			}
		}

		Array.prototype.random_element = function() { return this[Math.floor(Math.random() * this.length)] }

		function blank_rich_pres() {
			client.updatePresence({
				state: fnf_exe.name.replace(".exe","") + " Mod",
				details: "Getting ready to funk",
				largeImageKey: "homepage",
				instance: true, 
				startTimestamp: started
			});
		}

		function formatted_song_owner(song_owner) {
			if (song_owner == "gf") { return "Girlfriend" }
			if (song_owner == "dad") { return "Daddy Dearest" }
			if (song_owner == "skid_and_pump") { return "Skid and Pump" }
			if (song_owner == "pico") { return "Pico" }
			if (song_owner == "mom") { return "Mommy Mearest" }
			if (song_owner == "lemon_demon" || song_owner == "christmas_lemon_demon") { return "Lemon Demon" }
			if (song_owner == "mom_and_dad") { return "Mommy and Daddy" }
			if (song_owner == "senpai_1") { return "Senpai" }
			if (song_owner == "senpai_2") { return "Pissed off Senpai" }
			if (song_owner == "senpai_3") { return "Senpai's Spirit" }
			if (song_owner == "whitty_1") { return "Whitty" }
			if (song_owner == "whitty_2") { return "Enraged Whitty" }
			
		}

		const songs = {
			gf: [
				"tutorial"],
			dad: [
				"bopeebo",
				"fresh",
				"dadbattle"],
			skid_and_pump: [
				"spookeez",
				"south"],
			pico: [
				"pico",
				"philly",
				"blammed"],
			mom: [
				"satin-panties",
				"high",
				"milf"],
			lemon_demon: [
				"monster"],
			christmas_lemon_demon: [
				"winter-horrorland"],
			mom_and_dad: [
				"cocoa",
				"eggnog"],
			senpai_1: [
				"senpai"],
			senpai_2: [
				"roses"],
			senpai_3: [
				"thorns"],
			whitty_1: [
				"lo-fight",
				"overhead"],
			whitty_2: [
				"ballistic" ],
			tricky_clown_1: [
				"improbable-outset"],
			tricky_clown_2: [
				"madness"],
			
		}

		const all_songs = [
			"tutorial",
			"bopeebo",
			"fresh",
			"dadbattle",
			"spookeez",
			"south",
			"pico",
			"philly",
			"blammed",
			"satin-panties",
			"high",
			"milf",
			"monster",
			"winter-horrorland",
			"cocoa",
			"eggnog",
			"senpai",
			"roses",
			"thorns",
			"lo-fight",
			"overhead",
			"ballistic",
			"ugh",
			"improbable-outset",
			"madness",
		]


		// MainMenuState event with "Freeplay Menu Selected" or "Story Menu Selected"
		// FreeplayState with song name
		// Character event with "created character {char_name}" use this to decide week along with previous MainMenuState

		// charnames 
		// gf (if only gf is made its the tutorial)
		// dad
		// spooky
		// monster (freeplay only)
		// pico
		// mom-car
		// parents-christmas // monster-christmas
		// senpai // senpai-angry // spirit
		// whitty // whittyCrazy
		fnf_data = {
			event: fnf_output.split(".")[0].replace("source/",""),
			message: fnf_output.split(":").splice(-1)[0].trim()
		}
		console.log(fnf_output)
		console.log(fnf_data)
		if (["vswhitty.exe", "tricky.exe"].includes(fnf_exe.name.toLowerCase())) {
			if (fnf_data.event == "MusicBeatState" && !animation_so_ignore) {
				console.log("reset")
				blank_rich_pres()
			}
			
			if (fnf_data.message = "new BPM map BUDDY []" && fnf_exe.name.toLowerCase() == "tricky.exe" && main_menu_state == "story") {
				client.updatePresence({
					state: `${fnf_exe.name.replace(".exe","")} Mod`,
					details: "Playing Story Mode",
					largeImageKey: "homepage",
					instance: true,
					startTimestamp: started
				});
			}

			if (fnf_output.includes("created character")) { 
				if (main_menu_state == "story") {
					
					story_rich_pres(fnf_output)
				}
			}
			console.log("message: " + fnf_data.message)
			if (fnf_output.includes("FreeplayState")) {
				if (fnf_output.split(":").splice(-1)[0].trim().toLowerCase() != "c") { // used fnf_output.split(":").splice(-1)[0].trim() because something wrong with .message and im blind
					if (main_menu_state == "freeplay" && !fnf_output.includes("CUR")) {
						presence_details = fnf_output.find_song().replace("-"," ").title()
					} if (fnf_exe.name.toLowerCase() == "tricky.exe") {
						animation_so_ignore = true
						setTimeout(() => { animation_so_ignore = false; console.log("SET FALSE")}, 7500) // 7.5s cause trick mod is a slow bitch
					}
					if (fnf_output.contains_any_of(all_songs)) {
						console.log("image becomes: " + fnf_output.find_song_owner())
						difficulty = fnf_output.split(":").slice(-1)[0].trim().split("-").slice(-1)[0].title()
						if (!fnf_output.contains_any_of(["easy","hard"])) { // if normal, because normal has no tag.
							console.log("yep")
							console.log(difficulty)
							difficulty = "Normal"
						}
						client.updatePresence({
							state: difficulty,
							details: "Playing "+presence_details,
							largeImageKey: fnf_output.find_song_owner(),
							instance: true,
							startTimestamp: started
						});
					}
				}
			}
			if (fnf_output.includes("MainMenuState")) {
				if (fnf_output.includes("Story")) {
					main_menu_state = "story"
				} if (fnf_output.includes("Freeplay")) {
					main_menu_state = "freeplay"
				}
				console.log(main_menu_state)
			}
		}
		else if (fnf_exe.name.toLowerCase() == "ugh.exe") {
			if (fnf_output.trim() == "source/MusicBeatState.hx:27: reg (x: -200 | y: -200 | w: 1792 | h: 1008)") {
				ugh_pres = false
				client.updatePresence({
					details: "Getting ready to funk",
					largeImageKey: "homepage",
					instance: true, 
					startTimestamp: started
				});
			}
			if (!ugh_pres) {
				if (fnf_output.trim() == "source/PlayState.hx:1607: DA ALT THO?: false") {
					ugh_pres = true
					client.updatePresence({
						state: "Boopin' Tankman",
						details: "Playing Ugh",
						largeImageKey: "tankman",
						instance: true,
						startTimestamp: started
					});
				}
			}
		}



		else { // if the exe is not recognised
			client.updatePresence({
				state: `Playing ${fnf_exe.name.replace(".exe","")} Mod`,
				largeImageKey: "homepage",
				startTimestamp: started
			})
		} 

	})
})