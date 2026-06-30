import { render, screen } from "@testing-library/react";
import ServiceLogList from "@/app/vehicles/components/service-log-list";
import * as useFetchServiceLogsModule from "@/app/vehicles/hooks/use-fetch-service-logs";
import { ServiceLogDTO } from "@/app/vehicles/types";

describe("ServiceLogList", () => {
  const mockServiceLogs: ServiceLogDTO[] = [
    {
      id: 1,
      serviceDate: new Date("2026-01-15"),
      serviceType: "Oil Change",
      description: "Regular oil change",
      repairCost: 50,
    },
    {
      id: 2,
      serviceDate: new Date("2026-06-20"),
      serviceType: "Tire Rotation",
      description: "Rotated tires",
      repairCost: 75,
    },
    {
      id: 3,
      serviceDate: new Date("2026-03-10"),
      serviceType: "Filter Replacement",
      description: "Replaced air filter",
      repairCost: 30,
    },
  ];

  beforeEach(() => {
    jest.spyOn(useFetchServiceLogsModule, "useFetchServiceLogs").mockReturnValue({
      data: mockServiceLogs,
      refresh: jest.fn(),
      loading: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render service logs sorted by date in descending order (newest first)", () => {
    render(<ServiceLogList vehicleId={1} />);

    const dateCells = screen.getAllByText(/\d{2}-\d{2}-\d{4}/);

    expect(dateCells[0]).toHaveTextContent("06-20-2026");
    expect(dateCells[1]).toHaveTextContent("03-10-2026");
    expect(dateCells[2]).toHaveTextContent("01-15-2026");
  });
});
