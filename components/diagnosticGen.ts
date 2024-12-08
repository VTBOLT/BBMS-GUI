interface Frame1 {
	wu_cyc_wup: number;
	wu_faulth: number;
	wu_isoline: number;
	wu_spi: number;
	wu_gpio7: number;
	VCOM_UV: number;
	VCOM_OV: number;
	VREG_UV: number;
	VTREF_OV: number;
	VTREF_UV: number;
	VDIG_OV: number;
	VANA_OV: number;
	Otchip: number;
	sense_minus_open: number;
	sense_plus_open: number;
	TCYCLE_OVF: number;
	VREG_OV: number;
	OVR_LATCH: number;
}

interface Frame2 {
	GPIO6_OPEN: number;
	GPIO7_OPEN: number;
	GPIO8_OPEN: number;
	GPIO9_OPEN: number;
	GPIO3_fastchg_OT: number;
	GPIO4_fastchg_OT: number;
	GPIO5_fastchg_OT: number;
	GPIO6_fastchg_OT: number;
	GPIO7_fastchg_OT: number;
	GPIO8_fastchg_OT: number;
	GPIO9_fastchg_OT: number;
	EoBtimeerror: number;
	CoCouOvF: number;
	TrimmCalOk: number;
	loss_gndref: number;
	loss_cgnd: number;
	loss_dgnd: number;
	loss_agnd: number;
}

interface Frame3 {
	BAL1_OPEN: number;
	BAL2_OPEN: number;
	BAL3_OPEN: number;
	BAL4_OPEN: number;
	BAL5_OPEN: number;
	BAL6_OPEN: number;
	BAL7_OPEN: number;
	BAL8_OPEN: number;
	BAL9_OPEN: number;
	BAL10_OPEN: number;
	BAL11_OPEN: number;
	BAL12_OPEN: number;
	BAL13_OPEN: number;
	BAL14_OPEN: number;
	EEPROM_DWNLD_DONE: number;
	GPIO3_OPEN: number;
	GPIO4_OPEN: number;
	GPIO5_OPEN: number;
}

interface Frame4 {
	BAL1_SHORT: number;
	BAL2_SHORT: number;
	BAL3_SHORT: number;
	BAL4_SHORT: number;
	BAL5_SHORT: number;
	BAL6_SHORT: number;
	BAL7_SHORT: number;
	BAL8_SHORT: number;
	BAL9_SHORT: number;
	BAL10_SHORT: number;
	BAL11_SHORT: number;
	BAL12_SHORT: number;
	BAL13_SHORT: number;
	BAL14_SHORT: number;
	VTREF_COMP_BIST_FAIL: number;
	VCOM_COMP_BIST_FAIL: number;
	VREG_COMP_BIST_FAIL: number;
	VBAT_COMP_BIST_FAIL: number;
}

interface Frame5 {
	CELL0_OPEN: number;
	CELL1_OPEN: number;
	CELL2_OPEN: number;
	CELL3_OPEN: number;
	CELL4_OPEN: number;
	CELL5_OPEN: number;
	CELL6_OPEN: number;
	CELL7_OPEN: number;
	CELL8_OPEN: number;
	CELL9_OPEN: number;
	CELL10_OPEN: number;
	CELL11_OPEN: number;
	CELL12_OPEN: number;
	CELL13_OPEN: number;
	CELL14_OPEN: number;
	VBAT_OPEN: number;
	HWSC_DONE: number;
	EEPROM_CRC_ERR_CAL_FF: number;
}

interface Frame6 {
	VCELL1_UV: number;
	VCELL2_UV: number;
	VCELL3_UV: number;
	VCELL4_UV: number;
	VCELL5_UV: number;
	VCELL6_UV: number;
	VCELL7_UV: number;
	VCELL8_UV: number;
	VCELL9_UV: number;
	VCELL10_UV: number;
	VCELL11_UV: number;
	VCELL12_UV: number;
	VCELL13_UV: number;
	VCELL14_UV: number;
	RAM_CRC_ERR: number;
	EEPROM_CRC_ERR_CAL_RAM: number;
	Comm_timeout_flt: number;
	EEPROM_CRC_ERR_SECT_0: number;
}

interface Frame7 {
	VCELL1_OV: number;
	VCELL2_OV: number;
	VCELL3_OV: number;
	VCELL4_OV: number;
	VCELL5_OV: number;
	VCELL6_OV: number;
	VCELL7_OV: number;
	VCELL8_OV: number;
	VCELL9_OV: number;
	VCELL10_OV: number;
	VCELL11_OV: number;
	VCELL12_OV: number;
	VCELL13_OV: number;
	VCELL14_OV: number;
	VSUM_UV: number;
	VBATTCRIT_UV: number;
	VBATT_WRN_UV: number;
	VBATT_WRN_OV: number;
}

interface Frame8 {
	GPIO3_UT: number;
	GPIO4_UT: number;
	GPIO5_UT: number;
	GPIO6_UT: number;
	GPIO7_UT: number;
	GPIO8_UT: number;
	GPIO9_UT: number;
	GPIO3_OT: number;
	GPIO4_OT: number;
	GPIO5_OT: number;
	GPIO6_OT: number;
	GPIO7_OT: number;
	GPIO8_OT: number;
	GPIO9_OT: number;
	VSUM_OV: number;
	VBATTCRIT_OV: number;
	eof_bal: number;
	bal_on: number;
}

interface Frame9 {
	VCELL1_BAL_UV: number;
	VCELL2_BAL_UV: number;
	VCELL3_BAL_UV: number;
	VCELL4_BAL_UV: number;
	VCELL5_BAL_UV: number;
	VCELL6_BAL_UV: number;
	VCELL7_BAL_UV: number;
	VCELL8_BAL_UV: number;
	VCELL9_BAL_UV: number;
	VCELL10_BAL_UV: number;
	VCELL11_BAL_UV: number;
	VCELL12_BAL_UV: number;
	VCELL13_BAL_UV: number;
	VCELL14_BAL_UV: number;
	GPO3on: number;
	GPO4on: number;
	GPO5on: number;
	GPO6on: number;
}

interface Frame10 {
	GPIO_BIST_FAIL: number;
	GPO3short: number;
	GPO4short: number;
	GPO5short: number;
	GPO6short: number;
	GPO7short: number;
	GPO8short: number;
	GPO9short: number;
	GPO7on: number;
	GPO8on: number;
	GPO9on: number;
	Fault_L_line_status: number;
}

interface Frame11 {
	MUX_BIST_FAIL: number;
	HeartBeat_En: number;
	FaultH_EN: number;
	FaultHline_fault: number;
	HeartBeat_fault: number;
}

interface Frame12 {
	BIST_BAL_COMP_LS_FAIL: number;
	BIST_BAL_COMP_HS_FAIL: number;
	HeartBeatCycle: number;
	curr_sense_ovc_sleep: number;
}

interface Frame13 {
	OPEN_BIST_FAIL: number;
	clk_mon_init_done: number;
	clk_mon_en: number;
	OSCFail: number;
	curr_sense_ovc_norm: number;
}

interface DiagnosticData {
	Frame1: Frame1;
	Frame2: Frame2;
	Frame3: Frame3;
	Frame4: Frame4;
	Frame5: Frame5;
	Frame6: Frame6;
	Frame7: Frame7;
	Frame8: Frame8;
	Frame9: Frame9;
	Frame10: Frame10;
	Frame11: Frame11;
	Frame12: Frame12;
	Frame13: Frame13;
}

// Helper function to generate random binary number (0 or 1)
const randomBinary = (): number => Math.round(Math.random());

// Generate random values for all frames
export const generateRandomDiagnosticData = (): DiagnosticData => ({
	Frame1: {
		wu_cyc_wup: randomBinary(),
		wu_faulth: randomBinary(),
		wu_isoline: randomBinary(),
		wu_spi: randomBinary(),
		wu_gpio7: randomBinary(),
		VCOM_UV: randomBinary(),
		VCOM_OV: randomBinary(),
		VREG_UV: randomBinary(),
		VTREF_OV: randomBinary(),
		VTREF_UV: randomBinary(),
		VDIG_OV: randomBinary(),
		VANA_OV: randomBinary(),
		Otchip: randomBinary(),
		sense_minus_open: randomBinary(),
		sense_plus_open: randomBinary(),
		TCYCLE_OVF: randomBinary(),
		VREG_OV: randomBinary(),
		OVR_LATCH: randomBinary(),
	},
	Frame2: {
		GPIO6_OPEN: randomBinary(),
		GPIO7_OPEN: randomBinary(),
		GPIO8_OPEN: randomBinary(),
		GPIO9_OPEN: randomBinary(),
		GPIO3_fastchg_OT: randomBinary(),
		GPIO4_fastchg_OT: randomBinary(),
		GPIO5_fastchg_OT: randomBinary(),
		GPIO6_fastchg_OT: randomBinary(),
		GPIO7_fastchg_OT: randomBinary(),
		GPIO8_fastchg_OT: randomBinary(),
		GPIO9_fastchg_OT: randomBinary(),
		EoBtimeerror: randomBinary(),
		CoCouOvF: randomBinary(),
		TrimmCalOk: randomBinary(),
		loss_gndref: randomBinary(),
		loss_cgnd: randomBinary(),
		loss_dgnd: randomBinary(),
		loss_agnd: randomBinary(),
	},
	Frame3: {
		BAL1_OPEN: randomBinary(),
		BAL2_OPEN: randomBinary(),
		BAL3_OPEN: randomBinary(),
		BAL4_OPEN: randomBinary(),
		BAL5_OPEN: randomBinary(),
		BAL6_OPEN: randomBinary(),
		BAL7_OPEN: randomBinary(),
		BAL8_OPEN: randomBinary(),
		BAL9_OPEN: randomBinary(),
		BAL10_OPEN: randomBinary(),
		BAL11_OPEN: randomBinary(),
		BAL12_OPEN: randomBinary(),
		BAL13_OPEN: randomBinary(),
		BAL14_OPEN: randomBinary(),
		EEPROM_DWNLD_DONE: randomBinary(),
		GPIO3_OPEN: randomBinary(),
		GPIO4_OPEN: randomBinary(),
		GPIO5_OPEN: randomBinary(),
	},
	Frame4: {
		BAL1_SHORT: randomBinary(),
		BAL2_SHORT: randomBinary(),
		BAL3_SHORT: randomBinary(),
		BAL4_SHORT: randomBinary(),
		BAL5_SHORT: randomBinary(),
		BAL6_SHORT: randomBinary(),
		BAL7_SHORT: randomBinary(),
		BAL8_SHORT: randomBinary(),
		BAL9_SHORT: randomBinary(),
		BAL10_SHORT: randomBinary(),
		BAL11_SHORT: randomBinary(),
		BAL12_SHORT: randomBinary(),
		BAL13_SHORT: randomBinary(),
		BAL14_SHORT: randomBinary(),
		VTREF_COMP_BIST_FAIL: randomBinary(),
		VCOM_COMP_BIST_FAIL: randomBinary(),
		VREG_COMP_BIST_FAIL: randomBinary(),
		VBAT_COMP_BIST_FAIL: randomBinary(),
	},
	Frame5: {
		CELL0_OPEN: randomBinary(),
		CELL1_OPEN: randomBinary(),
		CELL2_OPEN: randomBinary(),
		CELL3_OPEN: randomBinary(),
		CELL4_OPEN: randomBinary(),
		CELL5_OPEN: randomBinary(),
		CELL6_OPEN: randomBinary(),
		CELL7_OPEN: randomBinary(),
		CELL8_OPEN: randomBinary(),
		CELL9_OPEN: randomBinary(),
		CELL10_OPEN: randomBinary(),
		CELL11_OPEN: randomBinary(),
		CELL12_OPEN: randomBinary(),
		CELL13_OPEN: randomBinary(),
		CELL14_OPEN: randomBinary(),
		VBAT_OPEN: randomBinary(),
		HWSC_DONE: randomBinary(),
		EEPROM_CRC_ERR_CAL_FF: randomBinary(),
	},
	Frame6: {
		VCELL1_UV: randomBinary(),
		VCELL2_UV: randomBinary(),
		VCELL3_UV: randomBinary(),
		VCELL4_UV: randomBinary(),
		VCELL5_UV: randomBinary(),
		VCELL6_UV: randomBinary(),
		VCELL7_UV: randomBinary(),
		VCELL8_UV: randomBinary(),
		VCELL9_UV: randomBinary(),
		VCELL10_UV: randomBinary(),
		VCELL11_UV: randomBinary(),
		VCELL12_UV: randomBinary(),
		VCELL13_UV: randomBinary(),
		VCELL14_UV: randomBinary(),
		RAM_CRC_ERR: randomBinary(),
		EEPROM_CRC_ERR_CAL_RAM: randomBinary(),
		Comm_timeout_flt: randomBinary(),
		EEPROM_CRC_ERR_SECT_0: randomBinary(),
	},
	Frame7: {
		VCELL1_OV: randomBinary(),
		VCELL2_OV: randomBinary(),
		VCELL3_OV: randomBinary(),
		VCELL4_OV: randomBinary(),
		VCELL5_OV: randomBinary(),
		VCELL6_OV: randomBinary(),
		VCELL7_OV: randomBinary(),
		VCELL8_OV: randomBinary(),
		VCELL9_OV: randomBinary(),
		VCELL10_OV: randomBinary(),
		VCELL11_OV: randomBinary(),
		VCELL12_OV: randomBinary(),
		VCELL13_OV: randomBinary(),
		VCELL14_OV: randomBinary(),
		VSUM_UV: randomBinary(),
		VBATTCRIT_UV: randomBinary(),
		VBATT_WRN_UV: randomBinary(),
		VBATT_WRN_OV: randomBinary(),
	},
	Frame8: {
		GPIO3_UT: randomBinary(),
		GPIO4_UT: randomBinary(),
		GPIO5_UT: randomBinary(),
		GPIO6_UT: randomBinary(),
		GPIO7_UT: randomBinary(),
		GPIO8_UT: randomBinary(),
		GPIO9_UT: randomBinary(),
		GPIO3_OT: randomBinary(),
		GPIO4_OT: randomBinary(),
		GPIO5_OT: randomBinary(),
		GPIO6_OT: randomBinary(),
		GPIO7_OT: randomBinary(),
		GPIO8_OT: randomBinary(),
		GPIO9_OT: randomBinary(),
		VSUM_OV: randomBinary(),
		VBATTCRIT_OV: randomBinary(),
		eof_bal: randomBinary(),
		bal_on: randomBinary(),
	},
	Frame9: {
		VCELL1_BAL_UV: randomBinary(),
		VCELL2_BAL_UV: randomBinary(),
		VCELL3_BAL_UV: randomBinary(),
		VCELL4_BAL_UV: randomBinary(),
		VCELL5_BAL_UV: randomBinary(),
		VCELL6_BAL_UV: randomBinary(),
		VCELL7_BAL_UV: randomBinary(),
		VCELL8_BAL_UV: randomBinary(),
		VCELL9_BAL_UV: randomBinary(),
		VCELL10_BAL_UV: randomBinary(),
		VCELL11_BAL_UV: randomBinary(),
		VCELL12_BAL_UV: randomBinary(),
		VCELL13_BAL_UV: randomBinary(),
		VCELL14_BAL_UV: randomBinary(),
		GPO3on: randomBinary(),
		GPO4on: randomBinary(),
		GPO5on: randomBinary(),
		GPO6on: randomBinary(),
	},
	Frame10: {
		GPIO_BIST_FAIL: randomBinary(),
		GPO3short: randomBinary(),
		GPO4short: randomBinary(),
		GPO5short: randomBinary(),
		GPO6short: randomBinary(),
		GPO7short: randomBinary(),
		GPO8short: randomBinary(),
		GPO9short: randomBinary(),
		GPO7on: randomBinary(),
		GPO8on: randomBinary(),
		GPO9on: randomBinary(),
		Fault_L_line_status: randomBinary(),
	},
	Frame11: {
		MUX_BIST_FAIL: randomBinary(),
		HeartBeat_En: randomBinary(),
		FaultH_EN: randomBinary(),
		FaultHline_fault: randomBinary(),
		HeartBeat_fault: randomBinary(),
	},
	Frame12: {
		BIST_BAL_COMP_LS_FAIL: randomBinary(),
		BIST_BAL_COMP_HS_FAIL: randomBinary(),
		HeartBeatCycle: randomBinary(),
		curr_sense_ovc_sleep: randomBinary(),
	},
	Frame13: {
		OPEN_BIST_FAIL: randomBinary(),
		clk_mon_init_done: randomBinary(),
		clk_mon_en: randomBinary(),
		OSCFail: randomBinary(),
		curr_sense_ovc_norm: randomBinary(),
	},
});

// Function to print diagnostic data in a similar format to the original C code
export const printDiagnosticData = (data: DiagnosticData): string => {
	let fileOutput: string = "";
	// Frame1
	fileOutput +=
		`wu_cyc_wup=${data.Frame1.wu_cyc_wup},wu_faulth=${data.Frame1.wu_faulth},wu_isoline=${data.Frame1.wu_isoline},` +
		`wu_spi=${data.Frame1.wu_spi},wu_gpio7=${data.Frame1.wu_gpio7},VCOM_UV=${data.Frame1.VCOM_UV},VCOM_OV=${data.Frame1.VCOM_OV},` +
		`VREG_UV=${data.Frame1.VREG_UV},VTREF_OV=${data.Frame1.VTREF_OV},VTREF_UV=${data.Frame1.VTREF_UV},VDIG_OV=${data.Frame1.VDIG_OV},` +
		`VANA_OV=${data.Frame1.VANA_OV},Otchip=${data.Frame1.Otchip},sense_minus_open=${data.Frame1.sense_minus_open},` +
		`sense_plus_open=${data.Frame1.sense_plus_open},TCYCLE_OVF=${data.Frame1.TCYCLE_OVF},VREG_OV=${data.Frame1.VREG_OV},` +
		`OVR_LATCH=${data.Frame1.OVR_LATCH}`;

	// Frame2
	fileOutput +=
		`GPIO6_OPEN=${data.Frame2.GPIO6_OPEN},GPIO7_OPEN=${data.Frame2.GPIO7_OPEN},GPIO8_OPEN=${data.Frame2.GPIO8_OPEN},` +
		`GPIO9_OPEN=${data.Frame2.GPIO9_OPEN},GPIO3_fastchg_OT=${data.Frame2.GPIO3_fastchg_OT},GPIO4_fastchg_OT=${data.Frame2.GPIO4_fastchg_OT},` +
		`GPIO5_fastchg_OT=${data.Frame2.GPIO5_fastchg_OT},GPIO6_fastchg_OT=${data.Frame2.GPIO6_fastchg_OT},` +
		`GPIO7_fastchg_OT=${data.Frame2.GPIO7_fastchg_OT},GPIO8_fastchg_OT=${data.Frame2.GPIO8_fastchg_OT},` +
		`GPIO9_fastchg_OT=${data.Frame2.GPIO9_fastchg_OT},EoBtimeerror=${data.Frame2.EoBtimeerror},CoCouOvF=${data.Frame2.CoCouOvF},` +
		`TrimmCalOk=${data.Frame2.TrimmCalOk},loss_gndref=${data.Frame2.loss_gndref},loss_cgnd=${data.Frame2.loss_cgnd},` +
		`loss_dgnd=${data.Frame2.loss_dgnd},loss_agnd=${data.Frame2.loss_agnd}`;

	// Frame3
	fileOutput +=
		`BAL1_OPEN=${data.Frame3.BAL1_OPEN},BAL2_OPEN=${data.Frame3.BAL2_OPEN},BAL3_OPEN=${data.Frame3.BAL3_OPEN},` +
		`BAL4_OPEN=${data.Frame3.BAL4_OPEN},BAL5_OPEN=${data.Frame3.BAL5_OPEN},BAL6_OPEN=${data.Frame3.BAL6_OPEN},` +
		`BAL7_OPEN=${data.Frame3.BAL7_OPEN},BAL8_OPEN=${data.Frame3.BAL8_OPEN},BAL9_OPEN=${data.Frame3.BAL9_OPEN},` +
		`BAL10_OPEN=${data.Frame3.BAL10_OPEN},BAL11_OPEN=${data.Frame3.BAL11_OPEN},BAL12_OPEN=${data.Frame3.BAL12_OPEN},` +
		`BAL13_OPEN=${data.Frame3.BAL13_OPEN},BAL14_OPEN=${data.Frame3.BAL14_OPEN},EEPROM_DWNLD_DONE=${data.Frame3.EEPROM_DWNLD_DONE},` +
		`GPIO3_OPEN=${data.Frame3.GPIO3_OPEN},GPIO4_OPEN=${data.Frame3.GPIO4_OPEN},GPIO5_OPEN=${data.Frame3.GPIO5_OPEN}`;

	// Frame4
	fileOutput +=
		`BAL1_SHORT=${data.Frame4.BAL1_SHORT},BAL2_SHORT=${data.Frame4.BAL2_SHORT},BAL3_SHORT=${data.Frame4.BAL3_SHORT},` +
		`BAL4_SHORT=${data.Frame4.BAL4_SHORT},BAL5_SHORT=${data.Frame4.BAL5_SHORT},BAL6_SHORT=${data.Frame4.BAL6_SHORT},` +
		`BAL7_SHORT=${data.Frame4.BAL7_SHORT},BAL8_SHORT=${data.Frame4.BAL8_SHORT},BAL9_SHORT=${data.Frame4.BAL9_SHORT},` +
		`BAL10_SHORT=${data.Frame4.BAL10_SHORT},BAL11_SHORT=${data.Frame4.BAL11_SHORT},BAL12_SHORT=${data.Frame4.BAL12_SHORT},` +
		`BAL13_SHORT=${data.Frame4.BAL13_SHORT},BAL14_SHORT=${data.Frame4.BAL14_SHORT},VTREF_COMP_BIST_FAIL=${data.Frame4.VTREF_COMP_BIST_FAIL},` +
		`VCOM_COMP_BIST_FAIL=${data.Frame4.VCOM_COMP_BIST_FAIL},VREG_COMP_BIST_FAIL=${data.Frame4.VREG_COMP_BIST_FAIL},` +
		`VBAT_COMP_BIST_FAIL=${data.Frame4.VBAT_COMP_BIST_FAIL}`;

	// Frame5
	fileOutput +=
		`CELL0_OPEN=${data.Frame5.CELL0_OPEN},CELL1_OPEN=${data.Frame5.CELL1_OPEN},CELL2_OPEN=${data.Frame5.CELL2_OPEN},` +
		`CELL3_OPEN=${data.Frame5.CELL3_OPEN},CELL4_OPEN=${data.Frame5.CELL4_OPEN},CELL5_OPEN=${data.Frame5.CELL5_OPEN},` +
		`CELL6_OPEN=${data.Frame5.CELL6_OPEN},CELL7_OPEN=${data.Frame5.CELL7_OPEN},CELL8_OPEN=${data.Frame5.CELL8_OPEN},` +
		`CELL9_OPEN=${data.Frame5.CELL9_OPEN},CELL10_OPEN=${data.Frame5.CELL10_OPEN},CELL11_OPEN=${data.Frame5.CELL11_OPEN},` +
		`CELL12_OPEN=${data.Frame5.CELL12_OPEN},CELL13_OPEN=${data.Frame5.CELL13_OPEN},CELL14_OPEN=${data.Frame5.CELL14_OPEN},` +
		`VBAT_OPEN=${data.Frame5.VBAT_OPEN},HWSC_DONE=${data.Frame5.HWSC_DONE},EEPROM_CRC_ERR_CAL_FF=${data.Frame5.EEPROM_CRC_ERR_CAL_FF}`;

	// Frame6
	fileOutput +=
		`VCELL1_UV=${data.Frame6.VCELL1_UV},VCELL2_UV=${data.Frame6.VCELL2_UV},VCELL3_UV=${data.Frame6.VCELL3_UV},` +
		`VCELL4_UV=${data.Frame6.VCELL4_UV},VCELL5_UV=${data.Frame6.VCELL5_UV},VCELL6_UV=${data.Frame6.VCELL6_UV},` +
		`VCELL7_UV=${data.Frame6.VCELL7_UV},VCELL8_UV=${data.Frame6.VCELL8_UV},VCELL9_UV=${data.Frame6.VCELL9_UV},` +
		`VCELL10_UV=${data.Frame6.VCELL10_UV},VCELL11_UV=${data.Frame6.VCELL11_UV},VCELL12_UV=${data.Frame6.VCELL12_UV},` +
		`VCELL13_UV=${data.Frame6.VCELL13_UV},VCELL14_UV=${data.Frame6.VCELL14_UV},RAM_CRC_ERR=${data.Frame6.RAM_CRC_ERR},` +
		`EEPROM_CRC_ERR_CAL_RAM=${data.Frame6.EEPROM_CRC_ERR_CAL_RAM},Comm_timeout_flt=${data.Frame6.Comm_timeout_flt},` +
		`EEPROM_CRC_ERR_SECT_0=${data.Frame6.EEPROM_CRC_ERR_SECT_0}`;

	// Frame7
	fileOutput +=
		`VCELL1_OV=${data.Frame7.VCELL1_OV},VCELL2_OV=${data.Frame7.VCELL2_OV},VCELL3_OV=${data.Frame7.VCELL3_OV},` +
		`VCELL4_OV=${data.Frame7.VCELL4_OV},VCELL5_OV=${data.Frame7.VCELL5_OV},VCELL6_OV=${data.Frame7.VCELL6_OV},` +
		`VCELL7_OV=${data.Frame7.VCELL7_OV},VCELL8_OV=${data.Frame7.VCELL8_OV},VCELL9_OV=${data.Frame7.VCELL9_OV},` +
		`VCELL10_OV=${data.Frame7.VCELL10_OV},VCELL11_OV=${data.Frame7.VCELL11_OV},VCELL12_OV=${data.Frame7.VCELL12_OV},` +
		`VCELL13_OV=${data.Frame7.VCELL13_OV},VCELL14_OV=${data.Frame7.VCELL14_OV},VSUM_UV=${data.Frame7.VSUM_UV},` +
		`VBATTCRIT_UV=${data.Frame7.VBATTCRIT_UV},VBATT_WRN_UV=${data.Frame7.VBATT_WRN_UV},VBATT_WRN_OV=${data.Frame7.VBATT_WRN_OV}`;

	// Frame8
	fileOutput +=
		`GPIO3_UT=${data.Frame8.GPIO3_UT},GPIO4_UT=${data.Frame8.GPIO4_UT},GPIO5_UT=${data.Frame8.GPIO5_UT},` +
		`GPIO6_UT=${data.Frame8.GPIO6_UT},GPIO7_UT=${data.Frame8.GPIO7_UT},GPIO8_UT=${data.Frame8.GPIO8_UT},` +
		`GPIO9_UT=${data.Frame8.GPIO9_UT},GPIO3_OT=${data.Frame8.GPIO3_OT},GPIO4_OT=${data.Frame8.GPIO4_OT},` +
		`GPIO5_OT=${data.Frame8.GPIO5_OT},GPIO6_OT=${data.Frame8.GPIO6_OT},GPIO7_OT=${data.Frame8.GPIO7_OT},` +
		`GPIO8_OT=${data.Frame8.GPIO8_OT},GPIO9_OT=${data.Frame8.GPIO9_OT},VSUM_OV=${data.Frame8.VSUM_OV},` +
		`VBATTCRIT_OV=${data.Frame8.VBATTCRIT_OV},eof_bal=${data.Frame8.eof_bal},bal_on=${data.Frame8.bal_on}`;

	// Frame9
	fileOutput +=
		`VCELL1_BAL_UV=${data.Frame9.VCELL1_BAL_UV},VCELL2_BAL_UV=${data.Frame9.VCELL2_BAL_UV},` +
		`VCELL3_BAL_UV=${data.Frame9.VCELL3_BAL_UV},VCELL4_BAL_UV=${data.Frame9.VCELL4_BAL_UV},` +
		`VCELL5_BAL_UV=${data.Frame9.VCELL5_BAL_UV},VCELL6_BAL_UV=${data.Frame9.VCELL6_BAL_UV},` +
		`VCELL7_BAL_UV=${data.Frame9.VCELL7_BAL_UV},VCELL8_BAL_UV=${data.Frame9.VCELL8_BAL_UV},` +
		`VCELL9_BAL_UV=${data.Frame9.VCELL9_BAL_UV},VCELL10_BAL_UV=${data.Frame9.VCELL10_BAL_UV},` +
		`VCELL11_BAL_UV=${data.Frame9.VCELL11_BAL_UV},VCELL12_BAL_UV=${data.Frame9.VCELL12_BAL_UV},` +
		`VCELL13_BAL_UV=${data.Frame9.VCELL13_BAL_UV},VCELL14_BAL_UV=${data.Frame9.VCELL14_BAL_UV},` +
		`GPO3on=${data.Frame9.GPO3on},GPO4on=${data.Frame9.GPO4on},GPO5on=${data.Frame9.GPO5on},GPO6on=${data.Frame9.GPO6on}`;

	// Frame10
	fileOutput +=
		`GPIO_BIST_FAIL=${data.Frame10.GPIO_BIST_FAIL},GPO3short=${data.Frame10.GPO3short},` +
		`GPO4short=${data.Frame10.GPO4short},GPO5short=${data.Frame10.GPO5short},GPO6short=${data.Frame10.GPO6short},` +
		`GPO7short=${data.Frame10.GPO7short},GPO8short=${data.Frame10.GPO8short},GPO9short=${data.Frame10.GPO9short},` +
		`GPO7on=${data.Frame10.GPO7on},GPO8on=${data.Frame10.GPO8on},GPO9on=${data.Frame10.GPO9on},` +
		`Fault_L_line_status=${data.Frame10.Fault_L_line_status}`;

	// Frame11
	fileOutput +=
		`MUX_BIST_FAIL=${data.Frame11.MUX_BIST_FAIL},HeartBeat_En=${data.Frame11.HeartBeat_En},` +
		`FaultH_EN=${data.Frame11.FaultH_EN},FaultHline_fault=${data.Frame11.FaultHline_fault},` +
		`HeartBeat_fault=${data.Frame11.HeartBeat_fault}`;

	// Frame12
	fileOutput +=
		`BIST_BAL_COMP_LS_FAIL=${data.Frame12.BIST_BAL_COMP_LS_FAIL},` +
		`BIST_BAL_COMP_HS_FAIL=${data.Frame12.BIST_BAL_COMP_HS_FAIL},HeartBeatCycle=${data.Frame12.HeartBeatCycle},` +
		`curr_sense_ovc_sleep=${data.Frame12.curr_sense_ovc_sleep}`;

	// Frame13
	fileOutput +=
		`OPEN_BIST_FAIL=${data.Frame13.OPEN_BIST_FAIL},clk_mon_init_done=${data.Frame13.clk_mon_init_done},` +
		`clk_mon_en=${data.Frame13.clk_mon_en},OSCFail=${data.Frame13.OSCFail},curr_sense_ovc_norm=${data.Frame13.curr_sense_ovc_norm}`;

	return fileOutput;
};
