import Papa from 'papaparse';

export interface VestingCSVRow {
  beneficiary: string;
  token: string;
  amount: string;
  startTime: string;
  cliffDuration: string;
  duration: string;
  revocable: string;
}

export interface ParsedVestingData {
  beneficiaries: string[];
  tokens: string[];
  amounts: bigint[];
  startTimes: bigint[];
  cliffDurations: bigint[];
  durations: bigint[];
  revocables: boolean[];
}

export function parseCSVFile(file: File): Promise<ParsedVestingData> {
  return new Promise((resolve, reject) => {
    Papa.parse<VestingCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data;

          if (data.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }

          const beneficiaries: string[] = [];
          const tokens: string[] = [];
          const amounts: bigint[] = [];
          const startTimes: bigint[] = [];
          const cliffDurations: bigint[] = [];
          const durations: bigint[] = [];
          const revocables: boolean[] = [];

          for (let i = 0; i < data.length; i++) {
            const row = data[i];

            // Validar campos requeridos
            if (!row.beneficiary || !row.token || !row.amount || !row.duration) {
              reject(new Error(`Row ${i + 1}: Missing required fields`));
              return;
            }

            // Validar dirección del beneficiario
            if (!/^0x[a-fA-F0-9]{40}$/.test(row.beneficiary)) {
              reject(new Error(`Row ${i + 1}: Invalid beneficiary address`));
              return;
            }

            // Validar dirección del token
            if (!/^0x[a-fA-F0-9]{40}$/.test(row.token)) {
              reject(new Error(`Row ${i + 1}: Invalid token address`));
              return;
            }

            beneficiaries.push(row.beneficiary);
            tokens.push(row.token);

            try {
              // Parse amount (asumiendo que está en la unidad base del token)
              amounts.push(BigInt(row.amount));

              // Parse start time (0 para empezar inmediatamente, o timestamp unix)
              startTimes.push(row.startTime ? BigInt(row.startTime) : 0n);

              // Parse cliff duration (en segundos)
              cliffDurations.push(row.cliffDuration ? BigInt(row.cliffDuration) : 0n);

              // Parse duration (en segundos)
              durations.push(BigInt(row.duration));

              // Parse revocable (default false)
              revocables.push(
                row.revocable?.toLowerCase() === 'true' ||
                row.revocable?.toLowerCase() === '1'
              );
            } catch (error) {
              reject(new Error(`Row ${i + 1}: Invalid number format`));
              return;
            }
          }

          resolve({
            beneficiaries,
            tokens,
            amounts,
            startTimes,
            cliffDurations,
            durations,
            revocables,
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function generateCSVTemplate(): string {
  const headers = [
    'beneficiary',
    'token',
    'amount',
    'startTime',
    'cliffDuration',
    'duration',
    'revocable'
  ];

  const exampleRows = [
    [
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
      '1000000000', // 1000 USDC (6 decimals)
      '0', // Start immediately
      '2592000', // 30 days cliff
      '31536000', // 1 year duration
      'true'
    ],
    [
      '0x1234567890123456789012345678901234567890',
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      '5000000000', // 5000 USDC
      '1704067200', // Specific start date
      '0', // No cliff
      '15552000', // 6 months duration
      'false'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...exampleRows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSVTemplate() {
  const csvContent = generateCSVTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'vesting_template.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
