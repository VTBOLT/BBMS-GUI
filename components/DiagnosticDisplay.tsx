import React from "react";
import BurstDataDisplay from "./BurstDataDisplay";

export type BurstData = {
	[key: string]: {
		[key: string]: boolean | number;
	};
	Frame1: {
		wu_cyc_wup: boolean;
		wu_faulth: boolean;
		wu_isoline: boolean;
		wu_spi: boolean;
		wu_gpio7: boolean;
		VCOM_UV: boolean;
		VCOM_OV: boolean;
		VREG_UV: boolean;
		VTREF_OV: boolean;
		VTREF_UV: boolean;
		VDIG_OV: boolean;
		VANA_OV: boolean;
		Otchip: boolean;
		sense_minus_open: boolean;
		sense_plus_open: boolean;
		TCYCLE_OVF: boolean;
		VREG_OV: boolean;
		OVR_LATCH: boolean;
	};
	Frame2: {
		GPIO6_OPEN: boolean;
		GPIO7_OPEN: boolean;
		GPIO8_OPEN: boolean;
		GPIO9_OPEN: boolean;
		GPIO3_fastchg_OT: boolean;
		GPIO4_fastchg_OT: boolean;
		GPIO5_fastchg_OT: boolean;
		GPIO6_fastchg_OT: boolean;
		GPIO7_fastchg_OT: boolean;
		GPIO8_fastchg_OT: boolean;
		GPIO9_fastchg_OT: boolean;
		EoBtimeerror: boolean;
		CoCouOvF: boolean;
		TrimmCalOk: boolean;
		loss_gndref: boolean;
		loss_cgnd: boolean;
		loss_dgnd: boolean;
		loss_agnd: boolean;
	};
	Frame3: {
		BAL1_OPEN: boolean;
		BAL2_OPEN: boolean;
		BAL3_OPEN: boolean;
		BAL4_OPEN: boolean;
		BAL5_OPEN: boolean;
		BAL6_OPEN: boolean;
		BAL7_OPEN: boolean;
		BAL8_OPEN: boolean;
		BAL9_OPEN: boolean;
		BAL10_OPEN: boolean;
		BAL11_OPEN: boolean;
		BAL12_OPEN: boolean;
		BAL13_OPEN: boolean;
		BAL14_OPEN: boolean;
		EEPROM_DWNLD_DONE: boolean;
		GPIO3_OPEN: boolean;
		GPIO4_OPEN: boolean;
		GPIO5_OPEN: boolean;
	};
	Frame4: {
		BAL1_SHORT: boolean;
		BAL2_SHORT: boolean;
		BAL3_SHORT: boolean;
		BAL4_SHORT: boolean;
		BAL5_SHORT: boolean;
		BAL6_SHORT: boolean;
		BAL7_SHORT: boolean;
		BAL8_SHORT: boolean;
		BAL9_SHORT: boolean;
		BAL10_SHORT: boolean;
		BAL11_SHORT: boolean;
		BAL12_SHORT: boolean;
		BAL13_SHORT: boolean;
		BAL14_SHORT: boolean;
		VTREF_COMP_BIST_FAIL: boolean;
		VCOM_COMP_BIST_FAIL: boolean;
		VREG_COMP_BIST_FAIL: boolean;
		VBAT_COMP_BIST_FAIL: boolean;
	};
	Frame5: {
		CELL0_OPEN: boolean;
		CELL1_OPEN: boolean;
		CELL2_OPEN: boolean;
		CELL3_OPEN: boolean;
		CELL4_OPEN: boolean;
		CELL5_OPEN: boolean;
		CELL6_OPEN: boolean;
		CELL7_OPEN: boolean;
		CELL8_OPEN: boolean;
		CELL9_OPEN: boolean;
		CELL10_OPEN: boolean;
		CELL11_OPEN: boolean;
		CELL12_OPEN: boolean;
		CELL13_OPEN: boolean;
		CELL14_OPEN: boolean;
		VBAT_OPEN: boolean;
		HWSC_DONE: boolean;
		EEPROM_CRC_ERR_CAL_FF: boolean;
	};
	Frame6: {
		VCELL1_UV: boolean;
		VCELL2_UV: boolean;
		VCELL3_UV: boolean;
		VCELL4_UV: boolean;
		VCELL5_UV: boolean;
		VCELL6_UV: boolean;
		VCELL7_UV: boolean;
		VCELL8_UV: boolean;
		VCELL9_UV: boolean;
		VCELL10_UV: boolean;
		VCELL11_UV: boolean;
		VCELL12_UV: boolean;
		VCELL13_UV: boolean;
		VCELL14_UV: boolean;
		RAM_CRC_ERR: boolean;
		EEPROM_CRC_ERR_CAL_RAM: boolean;
		Comm_timeout_flt: boolean;
		EEPROM_CRC_ERR_SECT_0: boolean;
	};
	Frame7: {
		VCELL1_OV: boolean;
		VCELL2_OV: boolean;
		VCELL3_OV: boolean;
		VCELL4_OV: boolean;
		VCELL5_OV: boolean;
		VCELL6_OV: boolean;
		VCELL7_OV: boolean;
		VCELL8_OV: boolean;
		VCELL9_OV: boolean;
		VCELL10_OV: boolean;
		VCELL11_OV: boolean;
		VCELL12_OV: boolean;
		VCELL13_OV: boolean;
		VCELL14_OV: boolean;
		VSUM_UV: boolean;
		VBATTCRIT_UV: boolean;
		VBATT_WRN_UV: boolean;
		VBATT_WRN_OV: boolean;
	};
	Frame8: {
		GPIO3_UT: boolean;
		GPIO4_UT: boolean;
		GPIO5_UT: boolean;
		GPIO6_UT: boolean;
		GPIO7_UT: boolean;
		GPIO8_UT: boolean;
		GPIO9_UT: boolean;
		GPIO3_OT: boolean;
		GPIO4_OT: boolean;
		GPIO5_OT: boolean;
		GPIO6_OT: boolean;
		GPIO7_OT: boolean;
		GPIO8_OT: boolean;
		GPIO9_OT: boolean;
		VSUM_OV: boolean;
		VBATTCRIT_OV: boolean;
		eof_bal: boolean;
		bal_on: boolean;
	};
	Frame9: {
		VCELL1_BAL_UV: boolean;
		VCELL2_BAL_UV: boolean;
		VCELL3_BAL_UV: boolean;
		VCELL4_BAL_UV: boolean;
		VCELL5_BAL_UV: boolean;
		VCELL6_BAL_UV: boolean;
		VCELL7_BAL_UV: boolean;
		VCELL8_BAL_UV: boolean;
		VCELL9_BAL_UV: boolean;
		VCELL10_BAL_UV: boolean;
		VCELL11_BAL_UV: boolean;
		VCELL12_BAL_UV: boolean;
		VCELL13_BAL_UV: boolean;
		VCELL14_BAL_UV: boolean;
		GPO3on: boolean;
		GPO4on: boolean;
		GPO5on: boolean;
		GPO6on: boolean;
	};
	Frame10: {
		GPIO_BIST_FAIL: number;
		GPO3short: boolean;
		GPO4short: boolean;
		GPO5short: boolean;
		GPO6short: boolean;
		GPO7short: boolean;
		GPO8short: boolean;
		GPO9short: boolean;
		GPO7on: boolean;
		GPO8on: boolean;
		GPO9on: boolean;
		Fault_L_line_status: boolean;
	};
	Frame11: {
		MUX_BIST_FAIL: number;
		HeartBeat_En: boolean;
		FaultH_EN: boolean;
		FaultHline_fault: boolean;
		HeartBeat_fault: boolean;
	};
	Frame12: {
		BIST_BAL_COMP_LS_FAIL: number;
		BIST_BAL_COMP_HS_FAIL: number;
		HeartBeatCycle: number;
		curr_sense_ovc_sleep: boolean;
	};
	Frame13: {
		OPEN_BIST_FAIL: number;
		clk_mon_init_done: boolean;
		clk_mon_en: boolean;
		OSCFail: boolean;
		curr_sense_ovc_norm: boolean;
	};
};

function decodeBurstData(data: string): BurstData {
	const pairs = data.split(",").filter((s) => s.trim()); // Split on commas and remove empty strings
	const result: BurstData = {
		Frame1: {
			wu_cyc_wup: false,
			wu_faulth: false,
			wu_isoline: false,
			wu_spi: false,
			wu_gpio7: false,
			VCOM_UV: false,
			VCOM_OV: false,
			VREG_UV: false,
			VTREF_OV: false,
			VTREF_UV: false,
			VDIG_OV: false,
			VANA_OV: false,
			Otchip: false,
			sense_minus_open: false,
			sense_plus_open: false,
			TCYCLE_OVF: false,
			VREG_OV: false,
			OVR_LATCH: false,
		},
		Frame2: {
			GPIO6_OPEN: false,
			GPIO7_OPEN: false,
			GPIO8_OPEN: false,
			GPIO9_OPEN: false,
			GPIO3_fastchg_OT: false,
			GPIO4_fastchg_OT: false,
			GPIO5_fastchg_OT: false,
			GPIO6_fastchg_OT: false,
			GPIO7_fastchg_OT: false,
			GPIO8_fastchg_OT: false,
			GPIO9_fastchg_OT: false,
			EoBtimeerror: false,
			CoCouOvF: false,
			TrimmCalOk: false,
			loss_gndref: false,
			loss_cgnd: false,
			loss_dgnd: false,
			loss_agnd: false,
		},
		Frame3: {
			BAL1_OPEN: false,
			BAL2_OPEN: false,
			BAL3_OPEN: false,
			BAL4_OPEN: false,
			BAL5_OPEN: false,
			BAL6_OPEN: false,
			BAL7_OPEN: false,
			BAL8_OPEN: false,
			BAL9_OPEN: false,
			BAL10_OPEN: false,
			BAL11_OPEN: false,
			BAL12_OPEN: false,
			BAL13_OPEN: false,
			BAL14_OPEN: false,
			EEPROM_DWNLD_DONE: false,
			GPIO3_OPEN: false,
			GPIO4_OPEN: false,
			GPIO5_OPEN: false,
		},
		Frame4: {
			BAL1_SHORT: false,
			BAL2_SHORT: false,
			BAL3_SHORT: false,
			BAL4_SHORT: false,
			BAL5_SHORT: false,
			BAL6_SHORT: false,
			BAL7_SHORT: false,
			BAL8_SHORT: false,
			BAL9_SHORT: false,
			BAL10_SHORT: false,
			BAL11_SHORT: false,
			BAL12_SHORT: false,
			BAL13_SHORT: false,
			BAL14_SHORT: false,
			VTREF_COMP_BIST_FAIL: false,
			VCOM_COMP_BIST_FAIL: false,
			VREG_COMP_BIST_FAIL: false,
			VBAT_COMP_BIST_FAIL: false,
		},
		Frame5: {
			CELL0_OPEN: false,
			CELL1_OPEN: false,
			CELL2_OPEN: false,
			CELL3_OPEN: false,
			CELL4_OPEN: false,
			CELL5_OPEN: false,
			CELL6_OPEN: false,
			CELL7_OPEN: false,
			CELL8_OPEN: false,
			CELL9_OPEN: false,
			CELL10_OPEN: false,
			CELL11_OPEN: false,
			CELL12_OPEN: false,
			CELL13_OPEN: false,
			CELL14_OPEN: false,
			VBAT_OPEN: false,
			HWSC_DONE: false,
			EEPROM_CRC_ERR_CAL_FF: false,
		},
		Frame6: {
			VCELL1_UV: false,
			VCELL2_UV: false,
			VCELL3_UV: false,
			VCELL4_UV: false,
			VCELL5_UV: false,
			VCELL6_UV: false,
			VCELL7_UV: false,
			VCELL8_UV: false,
			VCELL9_UV: false,
			VCELL10_UV: false,
			VCELL11_UV: false,
			VCELL12_UV: false,
			VCELL13_UV: false,
			VCELL14_UV: false,
			RAM_CRC_ERR: false,
			EEPROM_CRC_ERR_CAL_RAM: false,
			Comm_timeout_flt: false,
			EEPROM_CRC_ERR_SECT_0: false,
		},
		Frame7: {
			VCELL1_OV: false,
			VCELL2_OV: false,
			VCELL3_OV: false,
			VCELL4_OV: false,
			VCELL5_OV: false,
			VCELL6_OV: false,
			VCELL7_OV: false,
			VCELL8_OV: false,
			VCELL9_OV: false,
			VCELL10_OV: false,
			VCELL11_OV: false,
			VCELL12_OV: false,
			VCELL13_OV: false,
			VCELL14_OV: false,
			VSUM_UV: false,
			VBATTCRIT_UV: false,
			VBATT_WRN_UV: false,
			VBATT_WRN_OV: false,
		},
		Frame8: {
			GPIO3_UT: false,
			GPIO4_UT: false,
			GPIO5_UT: false,
			GPIO6_UT: false,
			GPIO7_UT: false,
			GPIO8_UT: false,
			GPIO9_UT: false,
			GPIO3_OT: false,
			GPIO4_OT: false,
			GPIO5_OT: false,
			GPIO6_OT: false,
			GPIO7_OT: false,
			GPIO8_OT: false,
			GPIO9_OT: false,
			VSUM_OV: false,
			VBATTCRIT_OV: false,
			eof_bal: false,
			bal_on: false,
		},
		Frame9: {
			VCELL1_BAL_UV: false,
			VCELL2_BAL_UV: false,
			VCELL3_BAL_UV: false,
			VCELL4_BAL_UV: false,
			VCELL5_BAL_UV: false,
			VCELL6_BAL_UV: false,
			VCELL7_BAL_UV: false,
			VCELL8_BAL_UV: false,
			VCELL9_BAL_UV: false,
			VCELL10_BAL_UV: false,
			VCELL11_BAL_UV: false,
			VCELL12_BAL_UV: false,
			VCELL13_BAL_UV: false,
			VCELL14_BAL_UV: false,
			GPO3on: false,
			GPO4on: false,
			GPO5on: false,
			GPO6on: false,
		},
		Frame10: {
			GPIO_BIST_FAIL: 0,
			GPO3short: false,
			GPO4short: false,
			GPO5short: false,
			GPO6short: false,
			GPO7short: false,
			GPO8short: false,
			GPO9short: false,
			GPO7on: false,
			GPO8on: false,
			GPO9on: false,
			Fault_L_line_status: false,
		},
		Frame11: {
			MUX_BIST_FAIL: 0,
			HeartBeat_En: false,
			FaultH_EN: false,
			FaultHline_fault: false,
			HeartBeat_fault: false,
		},
		Frame12: {
			BIST_BAL_COMP_LS_FAIL: 0,
			BIST_BAL_COMP_HS_FAIL: 0,
			HeartBeatCycle: 0,
			curr_sense_ovc_sleep: false,
		},
		Frame13: {
			OPEN_BIST_FAIL: 0,
			clk_mon_init_done: false,
			clk_mon_en: false,
			OSCFail: false,
			curr_sense_ovc_norm: false,
		},
	};

	// Helper function to convert string "0" or "1" to boolean
	const toBool = (val: string): boolean => parseInt(val) === 1;

	for (const pair of pairs) {
		const [key, value] = pair.split("=");
		if (!key || value === undefined) continue;

		// Determine which frame this belongs to and the property name
		for (let i = 1; i <= 13; i++) {
			const frameName = `Frame${i}` as keyof BurstData;

			// Special handling for multi-bit fields
			if (key === "GPIO_BIST_FAIL" && frameName === "Frame10") {
				result[frameName][key] = parseInt(value);
				break;
			}
			if (key === "MUX_BIST_FAIL" && frameName === "Frame11") {
				result[frameName][key] = parseInt(value);
				break;
			}
			if (
				(key === "BIST_BAL_COMP_LS_FAIL" ||
					key === "BIST_BAL_COMP_HS_FAIL" ||
					key === "HeartBeatCycle") &&
				frameName === "Frame12"
			) {
				result[frameName][key] = parseInt(value);
				break;
			}
			if (key === "OPEN_BIST_FAIL" && frameName === "Frame13") {
				result[frameName][key] = parseInt(value);
				break;
			}

			// Try to assign to current frame
			const frameType = result[frameName];
			if (key in frameType) {
				frameType[key] = toBool(value);
				break;
			}
		}
	}

	return result as BurstData;
}

interface DiagnosticDisplayProps {
	diagnostics: string;
	nodeNum: number;
}

const DiagnosticDisplay: React.FC<DiagnosticDisplayProps> = ({
	diagnostics,
	nodeNum,
}) => {
	const parseDiagnostics = (data: string): BurstData => {
		const result = decodeBurstData(data);

		return result;
	};

	const diagnosticInfo = parseDiagnostics(diagnostics);

	return (
		<div className="p-4">
			<BurstDataDisplay data={diagnosticInfo} nodeNum={nodeNum} />
		</div>
	);
};

export default DiagnosticDisplay;
