const MapID = [3103,3203]; //3103 FAUNM , 3203 FAUHM
const TemplateID = [1000,1001,1002]; //3 entities(NM) with isBoss = true ... 3 boss or phases ?

module.exports = function DahGuide(mod) {
	let insideMap;
	let noticeEnabled = true;
	let enabled = true;
	let alertsEnabled = true;
	let hardMode = false;
	let BossID  = -1;
	let hooks = [];
	
	mod.hook('S_LOAD_TOPO', 3, (event) => 
	{
		insideMap = MapID.includes(event.zone);
		hardMode = event.zone === MapID[1];
		
		if(insideMap)
			Load();
		else
			Unload();
    });
	
	mod.command.add(['fau'], (arg) => {
		if (!arg) 
		{
			enabled=!enabled;
			NoticeMessage(`ur stupid fauw guide just got ${enabled ? 'enabled' : 'disabled'}`);
		}
		else
			switch (arg)
			{
				case "alerts":
				case "alert":
				case "a":
				alertsEnabled = !alertsEnabled;
				NoticeMessage(`Alerts just got ${alertsEnabled ? 'enabled' : 'disabled'}`);
				break;
				case "n":
				case "notice":
				noticeEnabled = !noticeEnabled;
				NoticeMessage(noticeEnabled ? 'Notices enabled':'Notices disabled');
			}
	});	
	
	function Load()
	{
		Hook('S_ACTION_STAGE', 9, (event)=>
		{
			if(!enabled || !insideMap)
				return;
			if(!TemplateID.includes(event.templateId))
				return;
			
			BossID = event.gameid;
			var actionTip = GetTip(event.skill.id%1000);
			if(actionTip)
			{
				if(noticeEnabled)
					NoticeMessage(actionTip.Notice);
				if(alertsEnabled)
					AlertMessage(actionTip.Notice);		
			}
		});
	}
	
	function Hook() 
	{
		hooks.push(mod.hook(...arguments));
	}
	function Unload() 
	{
		if (hooks.length) 
		{
			for (let h of hooks)
				mod.unhook(h);
			hooks = [];
		}
	}
	
	function AlertMessage(msg) 
	{
		if(NullOrEmpty(msg))
			return;
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: 43,
			chat: 0,
			channel: 0,
			message: msg
		});
	}
	
	function NoticeMessage(msg) 
	{
		if(NullOrEmpty(msg))
			return
		mod.send('S_CHAT', 3, {
			channel: 21,
			name: 'Guide',
			message: msg
		});		
	}
	
	function NullOrEmpty(str) { return (!str || 0 === str.length);}
	
	function GetTip(actionID)
	{
		switch(actionID)
		{	
			case 310: return {Notice: 'Purple agro -> haymaker',Alert:''};
			case 116: return {Notice: 'Haymaker',Alert:''};
			//case 102: return {Notice: 'Piledriver -> Knockdown',Alert:''};
			case 114: return {Notice: 'Piledriver KD',Alert:''};
			case 303: return {Notice: 'Donuts coming',Alert:''};
			case 304: return {Notice: 'Donuts coming',Alert:''};
			case 314: return {Notice: 'Shout',Alert:''};
			case 313: return {Notice: 'Shout coming',Alert:''};
			case 118: return {Notice: 'Outer to Inner',Alert:''};
			case 117: return {Notice: 'Inner to Outer',Alert:''};
			case 143: return {Notice: 'Stun jump',Alert:''};
			case 305: return {Notice: 'Range check',Alert:''};
			case 142: return {Notice: 'Shoulder Attack -> AoE stun',Alert:''};
			case 148: return {Notice: 'AoE Stun',Alert:''};
			case 125: return {Notice: 'Jump Kick',Alert:''};
			case 110: return {Notice: 'Spin(3stack bleed)',Alert:''};
			case 302: return {Notice: 'Shield (DPS)',Alert:''};
			case 146: return {Notice: 'Backside Knockback',Alert:''};
			default : return undefined;
		}
	}
}