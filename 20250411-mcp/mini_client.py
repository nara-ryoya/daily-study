import asyncio
from mcp.client.stdio import stdio_client, StdioServerParameters
from mcp import ClientSession

async def main():
    # (A) サーバスクリプトを python で起動
    server_params = StdioServerParameters(command="python", args=["mini_server.py"])

    # (B) async with を使って stdio_client を起動・管理
    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            # Initialize the connection
            await session.initialize()

            # (C) ツール呼び出し: hello_world
            result = await session.call_tool("add", {"a": 1, "b": 2})
            print("Tool result:", result.content)

if __name__ == "__main__":
    asyncio.run(main())
