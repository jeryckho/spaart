// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
		format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent}; //, SystemTrayMenuItem
use tauri::Manager;

fn main() {
	let quit = CustomMenuItem::new("quit".to_string(), "Quit");
	// let show = CustomMenuItem::new("show".to_string(), "Show");

	let tray_menu = SystemTrayMenu::new()
		// .add_item(show)
		// .add_native_item(SystemTrayMenuItem::Separator)
		.add_item(quit); // insert the menu items here
	let system_tray = SystemTray::new().with_menu(tray_menu);
	tauri::Builder::default()
			.system_tray(system_tray)
			.on_system_tray_event(|app, event| match event {
				SystemTrayEvent::LeftClick {
					position: _,
					size: _,
					..
				} => {
					// println!("system tray received a left click");
				}
				SystemTrayEvent::RightClick {
					position: _,
					size: _,
					..
				} => {
					// println!("system tray received a right click");
				}
				SystemTrayEvent::DoubleClick {
					position: _,
					size: _,
					..
				} => {
					// println!("system tray received a double click");
					let window = app.get_window("main").unwrap();
					window.show().unwrap();
				}
				SystemTrayEvent::MenuItemClick { id, .. } => {
					match id.as_str() {
						"quit" => {
							std::process::exit(0);
						}
						_ => {}
					}
				}
				_ => {}
			})
			.on_window_event(|event| match event.event() {
				tauri::WindowEvent::CloseRequested { api, .. } => {
				  event.window().hide().unwrap();
				  api.prevent_close();
				}
				_ => {}
			 })
			.invoke_handler(tauri::generate_handler![greet])
			.run(tauri::generate_context!())
			.expect("error while running tauri application");
}
