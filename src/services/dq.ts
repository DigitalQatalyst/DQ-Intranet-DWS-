import supabase from "../lib/supabaseClient";

export type DqLane = {
	id: string;
	title: string;
	subtitle: string;
	icon_url: string | null;
	color_hex: string;
	sort_order: number;
};

export type DqTile = {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	tone: "light" | "dark" | "green";
	href: string | null;
	sort_order: number;
};

export type DqLaneTileMap = { lane_id: string; tile_id: string };

export async function fetchDq6x() {
	const [{ data: lanes, error: e1 }, { data: tiles, error: e2 }, { data: map, error: e3 }, { data: copy, error: e4 }] = await Promise.all([
		supabase.from("dq_lanes").select("id,title,subtitle,icon_url,color_hex,sort_order").order("sort_order"),
		supabase.from("dq_tiles").select("id,title,subtitle,description,tone,href,sort_order").order("sort_order"),
		supabase.from("dq_lane_tile_map").select("lane_id,tile_id"),
		supabase.from("dq_6x_page_copy").select("key,value")
	]);
	const error = e1 || e2 || e3 || e4;
	if (error) throw error;
	return { lanes: (lanes ?? []) as DqLane[], tiles: (tiles ?? []) as DqTile[], map: (map ?? []) as DqLaneTileMap[], copy: copy ?? [] };
}

export type DqDnaNode = {
	id: number;
	role: "leftTop"|"rightTop"|"leftMid"|"center"|"rightMid"|"leftBot"|"rightBot";
	title: string;
	subtitle: string;
	fill: "navy"|"white";
	details: string[] | null;
	kb_url: string;
	lms_url: string;
};

export type DqDnaCallout = { role: DqDnaNode["role"]; text: string; side: "left"|"right"|"bottom" };

export async function fetchDna() {
	const [{ data: nodes, error: e1 }, { data: callouts, error: e2 }] = await Promise.all([
		supabase.from("dq_dna_nodes").select("id,role,title,subtitle,fill,details,kb_url,lms_url").order("id"),
		supabase.from("dq_dna_callouts").select("role,text,side")
	]);
	const error = e1 || e2;
	if (error) throw error;
	return { nodes: (nodes ?? []) as DqDnaNode[], callouts: (callouts ?? []) as DqDnaCallout[] };
}
