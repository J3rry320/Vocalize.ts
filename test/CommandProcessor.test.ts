import { CommandProcessor } from "../src/CommandProcessor";

describe("CommandProcessor", () => {
  it("should register and execute a command", () => {
    const processor = new CommandProcessor();
    const mockAction = jest.fn();

    processor.registerCommand("test command", mockAction);
    processor.executeCommand("test command");

    expect(mockAction).toHaveBeenCalled();
  });

  it("should not execute if command is not found", () => {
    const processor = new CommandProcessor();
    const mockAction = jest.fn();

    processor.registerCommand("test command", mockAction);
    processor.executeCommand("unknown command");

    expect(mockAction).not.toHaveBeenCalled();
  });
});
