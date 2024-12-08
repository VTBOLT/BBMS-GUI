import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BurstData } from "@/components/DiagnosticDisplay";

interface BurstDataDisplayProps {
	data: BurstData;
	nodeNum: number;
}

const StatusItem: React.FC<{
	label: string;
	value: boolean | number;
	isError?: boolean;
}> = ({ label, value }) => {
	const isActive = typeof value === "boolean" ? value : value !== 0;

	return (
		<div
			className={`flex items-center gap-2 rounded px-1 py-1 ${
				isActive
					? "bg-red-100 dark:bg-red-900"
					: "bg-green-100 dark:bg-green-900"
			} `}
		>
			<span>{label}</span>
		</div>
	);
};

const StatusGroup: React.FC<{
	title: string;
	items: { label: string; value: boolean | number; isError?: boolean }[];
	cols?: number;
}> = ({ title, items, cols = 6 }) => {
	return (
		<div className="mb-4">
			<h3 className="text-sm font-semibold mb-2">{title}</h3>
			<div className={`grid grid-cols-${cols} gap-2`}>
				{items.map((item, idx) => (
					<StatusItem
						key={idx}
						label={item.label}
						value={item.value}
						isError={item.isError}
					/>
				))}
			</div>
		</div>
	);
};

export default function BurstDataDisplay({
	data,
	nodeNum,
}: BurstDataDisplayProps) {
	return (
		<Card className="w-full">
			<div className="grid grid-cols-1"></div>
			<div className="grid grid-cols-4"></div>
			<div className="grid grid-cols-5"></div>
			<div className="grid grid-cols-6"></div>
			<div className="grid grid-cols-7"></div>
			<div className="grid grid-cols-8"></div>
			<CardHeader>
				<CardTitle>Node {nodeNum}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Wake-up Events */}
					<StatusGroup
						cols={5}
						title="Wake-up Events"
						items={[
							{
								label: "Cycle Wakeup",
								value: data.Frame1.wu_cyc_wup,
								isError: false,
							},
							{
								label: "Fault High",
								value: data.Frame1.wu_faulth,
							},
							{
								label: "ISO Line",
								value: data.Frame1.wu_isoline,
							},
							{
								label: "SPI",
								value: data.Frame1.wu_spi,
								isError: false,
							},
							{ label: "GPIO7", value: data.Frame1.wu_gpio7 },
						]}
					/>

					{/* Voltage Status */}
					<StatusGroup
						title="Voltage Status"
						items={[
							{
								label: "VCOM UV",
								value: data.Frame1.VCOM_UV,
							},
							{
								label: "VCOM OV",
								value: data.Frame1.VCOM_OV,
							},
							{
								label: "VREG UV",
								value: data.Frame1.VREG_UV,
							},
							{
								label: "VREG OV",
								value: data.Frame1.VREG_OV,
							},
							{
								label: "VSUM UV",
								value: data.Frame7.VSUM_UV,
							},
							{
								label: "VSUM OV",
								value: data.Frame8.VSUM_OV,
							},
						]}
					/>

					{/* Cell Status */}
					<StatusGroup
						cols={7}
						title="Cell Status"
						items={Array(14)
							.fill(0)
							.map((_, i) => ({
								label: `Cell ${i + 1} Issues`,
								value:
									data.Frame5[
										`CELL${i}_OPEN` as keyof typeof data.Frame5
									] ||
									data.Frame6[
										`VCELL${
											i + 1
										}_UV` as keyof typeof data.Frame6
									] ||
									data.Frame7[
										`VCELL${
											i + 1
										}_OV` as keyof typeof data.Frame7
									],
							}))}
					/>

					{/* Balance Status */}
					<StatusGroup
						cols={8}
						title="Balance Status"
						items={[
							{
								label: "Balance Active",
								value: data.Frame8.bal_on,
								isError: false,
							},
							{
								label: "Balance Done",
								value: data.Frame8.eof_bal,
								isError: false,
							},
							...Array(14)
								.fill(0)
								.map((_, i) => ({
									label: `Balance ${i + 1}`,
									value:
										data.Frame3[
											`BAL${
												i + 1
											}_OPEN` as keyof typeof data.Frame3
										] ||
										data.Frame4[
											`BAL${
												i + 1
											}_SHORT` as keyof typeof data.Frame4
										],
								})),
						]}
					/>

					{/* GPIO Status */}
					<StatusGroup
						cols={7}
						title="GPIO Status"
						items={Array(7)
							.fill(0)
							.map((_, i) => ({
								label: `GPIO ${i + 3} Issues`,
								value:
									data.Frame2[
										`GPIO${
											i + 3
										}_fastchg_OT` as keyof typeof data.Frame2
									] ||
									data.Frame8[
										`GPIO${
											i + 3
										}_OT` as keyof typeof data.Frame8
									] ||
									data.Frame8[
										`GPIO${
											i + 3
										}_UT` as keyof typeof data.Frame8
									],
							}))}
					/>

					{/* Diagnostic Status */}
					<StatusGroup
						cols={5}
						title="Diagnostics"
						items={[
							{
								label: "GPIO BIST Failure",
								value: data.Frame10.GPIO_BIST_FAIL,
							},
							{
								label: "MUX BIST Failure",
								value: data.Frame11.MUX_BIST_FAIL,
							},
							{
								label: "Balance LS BIST Failure",
								value: data.Frame12.BIST_BAL_COMP_LS_FAIL,
							},
							{
								label: "Balance HS BIST Failure",
								value: data.Frame12.BIST_BAL_COMP_HS_FAIL,
							},
							{
								label: "Open BIST Failure",
								value: data.Frame13.OPEN_BIST_FAIL,
							},
						]}
					/>

					{/* System Status */}
					<StatusGroup
						cols={5}
						title="System Status"
						items={[
							{
								label: "Heartbeat Active",
								value: data.Frame11.HeartBeat_En,
								isError: false,
							},
							{
								label: "Clock Monitor Done",
								value: data.Frame13.clk_mon_init_done,
								isError: false,
							},
							{
								label: "Clock Monitor En",
								value: data.Frame13.clk_mon_en,
								isError: false,
							},
							{
								label: "Oscillator Failure",
								value: data.Frame13.OSCFail,
							},
							{
								label: "EEPROM Complete",
								value: data.Frame3.EEPROM_DWNLD_DONE,
								isError: false,
							},
						]}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
